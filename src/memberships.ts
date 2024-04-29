import {
	MaxUint256,
	parseUnits,
	ZeroAddress,
	type ContractRunner,
} from 'ethers'
import {
	clientsSTokens,
	client,
	type STokensContract,
} from '@devprotocol/dev-kit'
import {
	isNotError,
	whenDefined,
	whenDefinedAll,
	whenNotError,
	whenNotErrorAll,
} from '@devprotocol/util-ts'
import { always, type KeyValuePair, xprod } from 'ramda'
import type { Membership } from './types'
import axios from 'axios'
import { bytes32Hex } from './bytes32Hex'
import pQueue from 'p-queue'
import { getTokenAddress } from './fixtures'
import { CurrencyOption } from './constants'
import BigNumber from 'bignumber.js'

const queue = new pQueue({ concurrency: 3 })

const check = async ({
	contract,
	pair: [mem, tokenId],
	account,
	base,
}: {
	readonly contract: STokensContract
	readonly pair: KeyValuePair<Membership, number>
	readonly account: string
	readonly base?: string
}) => {
	const payload = whenDefined(mem.payload, bytes32Hex)

	const sTokenContract = contract.contract()

	const testForPayload = await whenDefined(
		payload,
		async (v) =>
			(await queue.add(always(sTokenContract.payloadOf(tokenId)))) === v
	)
	const testForAccessControl =
		(await whenDefined(mem.accessControl?.url, async (_accessControl) => {
			const url = _accessControl.startsWith('http')
				? new URL(_accessControl)
				: new URL(_accessControl, base)

			// eslint-disable-next-line functional/no-expression-statement
			url.searchParams.set('account', account)

			const result = await axios(url.toString()).catch((err: Error) => err)
			const body = await whenNotError(result, (r) => r.data)
			return isNotError(body)
				? Number(body) === 1
					? true
					: new Error(`${url.href} returned a value other than 1.`)
				: body
		})) ?? null

	// eslint-disable-next-line functional/no-conditional-statement
	if (
		testForPayload === true &&
		(testForAccessControl === true || testForAccessControl === null)
	) {
		return mem
	}

	// eslint-disable-next-line functional/no-promise-reject
	return Promise.reject(
		testForAccessControl instanceof Error
			? testForAccessControl
			: new Error('Membership not found')
	)
}

/**
 * Create a validator function to check the user has the available membership(s).
 * @param options - all options
 * @param options.provider - ethers ContractRunner
 * @param options.propertyAddress - the property address
 * @param options.account - the account address
 * @param options.base - the base URL if the membership has an access control URL and it is a relative URL.
 * @returns the verifier function
 * @example
 *
 * ```ts
 * import { membershipVerifierFactory } from '@devprotocol/clubs-core'
 *
 * const hasOneOf = await membershipVerifierFactory({provider, propertyAddress, account})
 * const res = await hasOneOf(memberships)
 * ```
 */
export const membershipVerifierFactory = async ({
	provider,
	propertyAddress,
	account,
	base,
}: {
	readonly provider: ContractRunner
	readonly propertyAddress: string
	readonly account: string
	readonly base?: string
}) => {
	const clients = await clientsSTokens(provider)
	const contract =
		whenDefined(clients, ([l1, l2]) => l1 ?? l2) ??
		new Error('STokensManager instance cannot be created')

	const detectSTokens = whenNotError(contract, client.createDetectSTokens)
	// gets all sTokens of the passed Property address that the visitor have
	const allSTokens = await whenNotError(detectSTokens, (detector) =>
		queue.add(always(detector(propertyAddress, account)))
	)

	/**
	 * The verifier function
	 * @param memberships - the memberships to check (one of them is enough to pass the check)
	 * @returns the result
	 * @example
	 * ```ts
	 * const hasOneOf = await membershipVerifierFactory({provider, propertyAddress, account})
	 * const res = await hasOneOf(memberships)
	 * console.log(res)
	 * // { result: true, membership: { payload: '0x...', accessControl: { url: 'http://...' } } }
	 * ```
	 */
	return async (
		memberships: readonly Membership[]
	): Promise<{
		readonly result: boolean
		readonly membership?: Membership
		readonly error?: Error
	}> => {
		// https://ramdajs.com/docs/#xprod
		const pairs = whenNotError(allSTokens, (list) =>
			xprod(memberships, list ?? [])
		)

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
		const checkResult = await whenNotErrorAll(
			[contract, pairs],
			([STokens, _pairs]) =>
				_pairs.length > 0
					? Promise.any(
							_pairs.map(async (pair) =>
								check({ pair, base, contract: STokens, account })
							)
					  ).catch(
							(err: Error) => new Error('Membership not found', { cause: err })
					  )
					: memberships.length === 0
					? undefined
					: new Error(`account:${account} does not have any memberships.`)
		)

		const result = isNotError(checkResult)
			? {
					membership: checkResult,
					result: true,
			  }
			: {
					error: checkResult,
					result: false,
			  }

		// returns the result
		return result
	}
}

/**
 * Convert the membership object to the struct object.
 * The struct object is used in the `ERC20SimpleCollections.sol` contract.
 * https://github.com/dev-protocol/dynamic-s-tokens-simple-collections/blob/main/contracts/ERC20SimpleCollections.sol
 * @param mem membership object
 * @param chain chain id
 * @returns
 */
export const membershipToStruct = (
	mem: Membership,
	chain: number
): {
	readonly src: string
	readonly name: string
	readonly description: string
	readonly requiredTokenAmount: bigint
	readonly requiredTokenFee: bigint
	readonly gateway: string
	readonly token: string
} => {
	const hasNoPrice = mem.price === undefined
	const token = whenDefined(mem.currency, (currency) =>
		getTokenAddress(currency, chain)
	)
	const decimals = whenDefined(mem.currency, (currency) =>
		currency.toLowerCase() === CurrencyOption.USDC ? 6 : 18
	)
	return {
		src: mem.imageSrc,
		name: JSON.stringify(mem.name).slice(1, -1),
		description: JSON.stringify(mem.description).slice(1, -1),
		requiredTokenAmount:
			whenDefinedAll([mem.price, decimals], ([price, dp]) =>
				parseUnits(new BigNumber(price).dp(dp, 1).toFixed(), dp)
			) ?? MaxUint256,
		requiredTokenFee: hasNoPrice
			? MaxUint256
			: mem.fee?.percentage && decimals
			? parseUnits(
					new BigNumber(mem.price)
						.times(mem.fee.percentage)
						.dp(decimals, 1)
						.toFixed(),
					decimals
			  )
			: 0n,
		gateway: hasNoPrice ? ZeroAddress : mem.fee?.beneficiary ?? ZeroAddress,
		token: token ?? ZeroAddress,
	}
}
