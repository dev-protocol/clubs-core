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
	const clientsSTokens = vi.fn(async () => {
		return [
			{
				contract: () => ({
					payloadOf: async (id: number | string) =>
						Number(id) === CORRECT_TOKEN_ID
							? CORRECT_PAYLOAD
							: bytes32Hex(randomBytes(3)),
				}),
				positionsOfProperty: async () => [1, CORRECT_TOKEN_ID, 3],
				positionsOfOwner: async () => [CORRECT_TOKEN_ID, 3, 4],
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
})
