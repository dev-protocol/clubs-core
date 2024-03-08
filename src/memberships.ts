import type { ContractRunner } from 'ethers'
import {
	clientsSTokens,
	client,
	type STokensContract,
} from '@devprotocol/dev-kit'
import {
	isNotError,
	whenDefined,
	whenNotError,
	whenNotErrorAll,
} from '@devprotocol/util-ts'
import { type KeyValuePair, xprod } from 'ramda'
import type { Membership } from './types'
import axios from 'axios'
import { bytes32Hex } from './bytes32Hex'

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
		async (v) => (await sTokenContract.payloadOf(tokenId)) === v
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
 * @param options.memberships - all required memberships (verify one-of-them)
 * @param options.base - the base URL if the membership has an access control URL and it is a relative URL.
 * @returns the verifier function
 * @example
 *
 * ```ts
 * import { membershipVerifierFactory } from '@devprotocol/clubs-core'
 *
 * const hasRole = await membershipVerifierFactory({provider, propertyAddress, memberships})
 * const res = await hasRole('0x...')
 * ```
 */
export const membershipVerifierFactory = async ({
	provider,
	propertyAddress,
	memberships,
	base,
}: {
	readonly provider: ContractRunner
	readonly propertyAddress: string
	readonly memberships: readonly Membership[]
	readonly base?: string
}) => {
	const clients = await clientsSTokens(provider)
	const contract =
		whenDefined(clients, ([l1, l2]) => l1 ?? l2) ??
		new Error('STokensManager instance cannot be created')

	const detectSTokens = whenNotError(contract, client.createDetectSTokens)

	return async (
		account: string
	): Promise<{
		readonly result: boolean
		readonly membership?: Membership
		readonly error?: Error
	}> => {
		// gets all sTokens of the passed Property address that the visitor have
		const allSTokens = await whenNotError(detectSTokens, (detector) =>
			detector(propertyAddress, account)
		)

		// https://ramdajs.com/docs/#xprod
		const pairs = whenNotError(allSTokens, (list) => xprod(memberships, list))

		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
		const checkResult = await whenNotErrorAll(
			[contract, pairs],
			([STokens, _pairs]) =>
				Promise.any(
					_pairs.map(async (pair) =>
						check({ pair, base, contract: STokens, account })
					)
				).catch(
					(err: Error) => new Error('Membership not found', { cause: err })
				)
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
