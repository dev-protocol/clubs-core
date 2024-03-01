import { describe, expect, it, vi } from 'vitest'
import { membershipValidatorFactory } from './memberships'
import { JsonRpcProvider, ZeroAddress, randomBytes } from 'ethers'
import { Membership } from './types'
import { bytes32Hex } from './bytes32Hex'

const CORRECT_TOKEN_ID = 2
const CORRECT_PAYLOAD = bytes32Hex(randomBytes(3))
const WILL_BE_ERROR = 'http://error'
const WILL_BE_FAILED_TO_FETCH = 'http://fail'

vi.mock('@devprotocol/dev-kit', async () => {
	const actual = await vi.importActual('@devprotocol/dev-kit')
	const clientsSTokens = vi.fn(async (provider: JsonRpcProvider) => {
		const prov = provider._getConnection().url
		return [
			prov === WILL_BE_ERROR
				? undefined
				: {
						contract: () => ({
							payloadOf: async (id: number | string) =>
								Number(id) === CORRECT_TOKEN_ID
									? CORRECT_PAYLOAD
									: bytes32Hex(randomBytes(3)),
						}),
						positionsOfProperty: async () => [1, CORRECT_TOKEN_ID, 3],
						positionsOfOwner: async (account: string) =>
							account === ZeroAddress ? [CORRECT_TOKEN_ID, 3, 4] : [],
				  },
		]
	})
	return { ...actual, clientsSTokens }
})
vi.mock('cross-fetch', () => {
	const lib = vi.fn(async (url: string) => {
		return url.includes(WILL_BE_ERROR)
			? Promise.reject(new Error('ERROR'))
			: url.includes(WILL_BE_FAILED_TO_FETCH)
			? { ok: false }
			: { ok: true, text: async () => `1` }
	})
	return { default: lib }
})

describe('membershipValidatorFactory', () => {
	it('should return validator function', async () => {
		const fn = await membershipValidatorFactory({
			provider: new JsonRpcProvider(WILL_BE_ERROR),
			propertyAddress: ZeroAddress,
			memberships: [{ payload: CORRECT_PAYLOAD } as unknown as Membership],
		})
		const res = await fn(ZeroAddress)

		expect(res).toBeTruthy()
	})

	describe('the validator function', () => {
		it('should return {result: true, membership: THE_FIRST_MATCH_MEMBERSHIP}', async () => {
			const membership = { payload: CORRECT_PAYLOAD }
			const fn = await membershipValidatorFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				memberships: [membership as unknown as Membership],
			})
			const res = await fn(ZeroAddress)

			expect(res).toEqual({
				result: true,
				membership,
			})
		})

		it('should return {result: false, error: THE_ERROR} when the user does not have required membership', async () => {
			const membership = { payload: randomBytes(3) }
			const fn = await membershipValidatorFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				memberships: [membership as unknown as Membership],
			})
			const res = await fn(ZeroAddress)

			expect(res).toEqual({
				result: false,
				error: new Error('Membership not found'),
			})
		})

		it('should return {result: false, error: THE_ERROR} when creating STokensManager instance is failed', async () => {
			const membership = { payload: randomBytes(3) }
			const fn = await membershipValidatorFactory({
				provider: new JsonRpcProvider(WILL_BE_ERROR),
				propertyAddress: ZeroAddress,
				memberships: [membership as unknown as Membership],
			})
			const res = await fn(ZeroAddress)

			expect(res).toEqual({
				result: false,
				error: new Error('STokensManager instance cannot be created'),
			})
		})
	})
})
