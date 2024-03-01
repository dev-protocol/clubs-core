import { describe, expect, it, vi } from 'vitest'
import { membershipVerifierFactory } from './memberships'
import { JsonRpcProvider, ZeroAddress, randomBytes } from 'ethers'
import { Membership } from './types'
import { bytes32Hex } from './bytes32Hex'
import fetch from 'cross-fetch'

const CORRECT_TOKEN_ID = 2
const CORRECT_PAYLOAD = bytes32Hex(randomBytes(3))
const WILL_BE_ERROR = 'http://error'
const WILL_BE_FAILED_TO_FETCH = 'http://fail'
const WILL_BE_UNEXPECTED = 'http://unexpected'

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
	const lib = vi.fn(async (url: URL) => {
		return url.href.includes(WILL_BE_ERROR)
			? Promise.reject(new Error('ERROR'))
			: url.href.includes(WILL_BE_FAILED_TO_FETCH)
			? { ok: false, url }
			: url.href.includes(WILL_BE_UNEXPECTED)
			? { ok: true, url, text: async () => `2` }
			: { ok: true, url, text: async () => `1` }
	})
	return { default: lib }
})

describe('membershipValidatorFactory', () => {
	it('should return validator function', async () => {
		const fn = await membershipVerifierFactory({
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
			const fn = await membershipVerifierFactory({
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

		it('should use the given options.base as a base URL of the accessControl.url if it is a relative URL', async () => {
			const membership = {
				payload: CORRECT_PAYLOAD,
				accessControl: { url: '/x/y/z' },
			}
			const fn = await membershipVerifierFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				memberships: [membership as unknown as Membership],
				base: 'http://base',
			})
			const res = await fn(ZeroAddress)

			expect(res).toEqual({
				result: true,
				membership,
			})

			expect(fetch).toHaveBeenCalledWith(
				new URL(
					'http://base/x/y/z?account=0x0000000000000000000000000000000000000000'
				)
			)
		})

		it('should return {result: false, error: THE_ERROR} when the user does not have required membership', async () => {
			const membership = { payload: randomBytes(3) }
			const fn = await membershipVerifierFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				memberships: [membership as unknown as Membership],
			})
			const res = await fn(ZeroAddress)

			expect(res).toEqual({
				result: false,
				error: new Error('Membership not found'),
			})
			expect((res.error?.cause as any).errors).toEqual([
				new Error('Membership not found'),
				new Error('Membership not found'),
			])
		})

		it('should return {result: false, error: THE_ERROR} when creating STokensManager instance is failed', async () => {
			const membership = { payload: randomBytes(3) }
			const fn = await membershipVerifierFactory({
				provider: new JsonRpcProvider(WILL_BE_ERROR),
				propertyAddress: ZeroAddress,
				memberships: [membership as unknown as Membership],
			})
			const res = await fn(ZeroAddress)

			expect(res).toEqual({
				result: false,
				error: new Error('STokensManager instance cannot be created'),
			})
			expect(res.error?.cause).toBe(undefined)
		})

		it('should return {result: false, error: THE_ERROR} when the accessControl returned error', async () => {
			const membership = {
				payload: randomBytes(3),
				accessControl: { url: WILL_BE_ERROR },
			}
			const fn = await membershipVerifierFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				memberships: [membership as unknown as Membership],
			})
			const res = await fn(ZeroAddress)

			expect(res).toEqual({
				result: false,
				error: new Error('Membership not found'),
			})
			expect((res.error?.cause as any).errors).toEqual([
				new Error('ERROR'),
				new Error('ERROR'),
			])
		})

		it('should return {result: false, error: THE_ERROR} when fetching the accessControl is failed', async () => {
			const membership = {
				payload: randomBytes(3),
				accessControl: { url: WILL_BE_FAILED_TO_FETCH },
			}
			const fn = await membershipVerifierFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				memberships: [membership as unknown as Membership],
			})
			const res = await fn(ZeroAddress)

			expect(res).toEqual({
				result: false,
				error: new Error('Membership not found'),
			})
			expect((res.error?.cause as any).errors).toEqual([
				new Error('Bad request'),
				new Error('Bad request'),
			])
		})

		it('should return {result: false, error: THE_ERROR} when the accessControl returned an unexpected value', async () => {
			const membership = {
				payload: randomBytes(3),
				accessControl: { url: WILL_BE_UNEXPECTED },
			}
			const fn = await membershipVerifierFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				memberships: [membership as unknown as Membership],
			})
			const res = await fn(ZeroAddress)

			expect(res).toEqual({
				result: false,
				error: new Error('Membership not found'),
			})
			expect((res.error?.cause as any).errors).toEqual([
				new Error(
					'http://unexpected/?account=0x0000000000000000000000000000000000000000 returned a value other than 1.'
				),
				new Error(
					'http://unexpected/?account=0x0000000000000000000000000000000000000000 returned a value other than 1.'
				),
			])
		})
	})
})
