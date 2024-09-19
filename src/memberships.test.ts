import { describe, expect, it, vi } from 'vitest'
import {
	membershipVerifierFactory,
	membershipToStruct,
	findOfferings,
} from './memberships'
import {
	JsonRpcProvider,
	MaxUint256,
	ZeroAddress,
	formatUnits,
	randomBytes,
} from 'ethers'
import { Membership } from './types'
import { bytes32Hex } from './bytes32Hex'
import axios from 'axios'
import BigNumber from 'bignumber.js'

const CORRECT_TOKEN_ID = 2
const CORRECT_PAYLOAD = bytes32Hex(randomBytes(3))
const WILL_BE_ERROR = 'http://error'
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
vi.mock('axios', () => {
	const lib = vi.fn(async (url: string) => {
		return url.includes(WILL_BE_ERROR)
			? Promise.reject(new Error('ERROR'))
			: url.includes(WILL_BE_UNEXPECTED)
			? { url, data: `2` }
			: { url, data: `1` }
	})
	return { default: lib }
})

describe('membershipValidatorFactory', () => {
	it('should return validator function', async () => {
		const fn = await membershipVerifierFactory({
			provider: new JsonRpcProvider(WILL_BE_ERROR),
			propertyAddress: ZeroAddress,
			account: ZeroAddress,
		})
		const res = await fn([
			{ payload: CORRECT_PAYLOAD } as unknown as Membership,
		])

		expect(res).toBeTruthy()
	})

	describe('the validator function', () => {
		it('should return {result: true, membership: THE_FIRST_MATCH_MEMBERSHIP}', async () => {
			const membership = { payload: CORRECT_PAYLOAD }
			const fn = await membershipVerifierFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				account: ZeroAddress,
			})
			const res = await fn([membership as unknown as Membership])

			expect(res).toEqual({
				result: true,
				membership,
			})
		})

		it('should return {result: true, membership: undefined} if the required memberships is empty', async () => {
			const fn = await membershipVerifierFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				account: ZeroAddress,
			})
			const res = await fn([])

			expect(res).toEqual({
				result: true,
				membership: undefined,
			})
		})

		it('should return {result: true, membership: undefined} if the required memberships is empty and the user also does not have any memberships.', async () => {
			const fn = await membershipVerifierFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				account: '0x533ae9d683B10C02EbDb05471642F85230071FC3',
			})
			const res = await fn([])

			expect(res).toEqual({
				result: true,
				membership: undefined,
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
				account: ZeroAddress,
				base: 'http://base',
			})
			const res = await fn([membership as unknown as Membership])

			expect(res).toEqual({
				result: true,
				membership,
			})

			expect(axios).toHaveBeenCalledWith(
				new URL(
					'http://base/x/y/z?account=0x0000000000000000000000000000000000000000'
				).toString()
			)
		})

		it('should return {result: false, error: THE_ERROR} when the user does not have any memberships.', async () => {
			const membership = { payload: randomBytes(3) }
			const fn = await membershipVerifierFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				account: '0x533ae9d683B10C02EbDb05471642F85230071FC3',
			})
			const res = await fn([membership as unknown as Membership])

			expect(res).toEqual({
				result: false,
				error: new Error(
					'account:0x533ae9d683B10C02EbDb05471642F85230071FC3 does not have any memberships.'
				),
			})
			expect(res.error?.cause as any).toBeUndefined()
		})

		it('should return {result: false, error: THE_ERROR} when the user does not have required membership', async () => {
			const membership = { payload: randomBytes(3) }
			const fn = await membershipVerifierFactory({
				provider: new JsonRpcProvider(''),
				propertyAddress: ZeroAddress,
				account: ZeroAddress,
			})
			const res = await fn([membership as unknown as Membership])

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
				account: ZeroAddress,
			})
			const res = await fn([membership as unknown as Membership])

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
				account: ZeroAddress,
			})
			const res = await fn([membership as unknown as Membership])

			expect(res).toEqual({
				result: false,
				error: new Error('Membership not found'),
			})
			expect((res.error?.cause as any).errors).toEqual([
				new Error('ERROR'),
				new Error('ERROR'),
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
				account: ZeroAddress,
			})
			const res = await fn([membership as unknown as Membership])

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

describe('membershipToStruct', () => {
	it('should return a struct of the membership', () => {
		const membership: Membership = {
			id: 'id',
			imageSrc: 'http://image',
			name: 'name',
			description: 'description',
			price: 100,
			currency: 'USDC',
			fee: {
				beneficiary: '0x533ae9d683B10C02EbDb05471642F85230071FC3',
				percentage: 0.1,
			},
			payload: randomBytes(3),
		}
		const res = membershipToStruct(membership, 137)

		expect(res).toEqual({
			name: 'name',
			src: 'http://image',
			description: 'description',
			gateway: '0x533ae9d683B10C02EbDb05471642F85230071FC3',
			requiredTokenAmount: 100000000n,
			requiredTokenFee: 10000000n,
			token: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
		})
	})

	describe('when the name includes multiple lines', () => {
		it('should be JSON.stringify applied string', () => {
			const membership: Membership = {
				id: 'id',
				imageSrc: 'http://image',
				name: `name
				includes
				multiple
				lines`,
				description: 'description',
				payload: randomBytes(3),
			}
			const res = membershipToStruct(membership, 137)

			expect(res.name).toBe(JSON.stringify(membership.name).slice(1, -1))
		})
	})

	describe('when the description includes multiple lines', () => {
		it('should be JSON.stringify applied string', () => {
			const membership: Membership = {
				id: 'id',
				imageSrc: 'http://image',
				name: 'name',
				description: `description
				includes
				multiple
				lines`,
				payload: randomBytes(3),
			}
			const res = membershipToStruct(membership, 137)

			expect(res.description).toBe(
				JSON.stringify(membership.description).slice(1, -1)
			)
		})
	})

	describe('requiredTokenAmount', () => {
		const base = {
			id: 'id',
			imageSrc: 'http://image',
			name: 'name',
			description: 'description',
			payload: randomBytes(3),
		}
		it('should be 10^18 multiplied bigint to the price (DEV)', () => {
			const membership: Membership = {
				price: 100,
				currency: 'DEV',
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenAmount).toBe(100_0000000000_00000000n)
		})
		it('should be 10^18 multiplied bigint to the price (ETH)', () => {
			const membership: Membership = {
				price: 200,
				currency: 'ETH',
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenAmount).toBe(200_0000000000_00000000n)
		})
		it('should be 10^18 multiplied bigint to the price (MATIC)', () => {
			const membership: Membership = {
				price: 300,
				currency: 'MATIC',
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenAmount).toBe(300_0000000000_00000000n)
		})
		it('should be 10^6 multiplied bigint to the price (USDC)', () => {
			const membership: Membership = {
				price: 400,
				currency: 'USDC',
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenAmount).toBe(400_000000n)
		})

		it('should be rounded down if the price has a decimal place smaller value than 10^-18. (DEV)', () => {
			const membership: Membership = {
				price: new BigNumber('2.111111111111111111').toNumber(),
				currency: 'DEV',
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenAmount).toBe(2111111111111111000n)
		})
		it('should be rounded down if the price has a decimal place smaller value than 10^-18. (ETH)', () => {
			const membership: Membership = {
				price: new BigNumber('2.111111111111111111').toNumber(),
				currency: 'ETH',
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenAmount).toBe(2111111111111111000n)
		})
		it('should be rounded down if the price has a decimal place smaller value than 10^-18. (MATIC)', () => {
			const membership: Membership = {
				price: new BigNumber('2.111111111111111111').toNumber(),
				currency: 'MATIC',
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenAmount).toBe(2111111111111111000n)
		})
		it('should be rounded down if the price has a decimal place smaller value than 10^-6. (USDC)', () => {
			const membership: Membership = {
				price: new BigNumber('2.111111111111111111').toNumber(),
				currency: 'USDC',
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenAmount).toBe(2111111n)
		})

		it('should be MAX_UINT256 if the price is not defined', () => {
			const membership: Membership = {
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenAmount).toBe(MaxUint256)
		})
		it('should be MAX_UINT256 if the decimal place is not found', () => {
			const membership: Membership = {
				...base,
			}
			const res = membershipToStruct(membership, 123456789)

			expect(res.requiredTokenAmount).toBe(MaxUint256)
		})
	})

	describe('requiredTokenFee', () => {
		const base = {
			id: 'id',
			imageSrc: 'http://image',
			name: 'name',
			description: 'description',
			payload: randomBytes(3),
		}
		it('should be a bigint that percentage multiplied to the requiredTokenAmount', () => {
			const membership: Membership = {
				price: 100,
				currency: 'DEV',
				fee: {
					percentage: 0.123,
					beneficiary: ZeroAddress,
				},
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenFee).toBe(
				(res.requiredTokenAmount * 123n) / 1000n
			)
		})
		it('should be rounded down if the calculated value has a decimal place smaller value than 10^-18. (DEV)', () => {
			const percentage = new BigNumber('0.141592653589793238462643').toNumber()
			const membership: Membership = {
				price: 1,
				currency: 'DEV',
				fee: {
					percentage,
					beneficiary: ZeroAddress,
				},
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenFee).toBe(141592653589793230n)
			expect(formatUnits(res.requiredTokenFee, 18)).toBe('0.14159265358979323')
		})
		it('should be rounded down if the calculated value has a decimal place smaller value than 10^-18. (ETH)', () => {
			const percentage = new BigNumber('0.141592653589793238462643').toNumber()
			const membership: Membership = {
				price: 1,
				currency: 'ETH',
				fee: {
					percentage,
					beneficiary: ZeroAddress,
				},
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenFee).toBe(141592653589793230n)
			expect(formatUnits(res.requiredTokenFee, 18)).toBe('0.14159265358979323')
		})
		it('should be rounded down if the calculated value has a decimal place smaller value than 10^-18. (MATIC)', () => {
			const percentage = new BigNumber('0.141592653589793238462643').toNumber()
			const membership: Membership = {
				price: 1,
				currency: 'MATIC',
				fee: {
					percentage,
					beneficiary: ZeroAddress,
				},
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenFee).toBe(141592653589793230n)
			expect(formatUnits(res.requiredTokenFee, 18)).toBe('0.14159265358979323')
		})
		it('should be rounded down if the calculated value has a decimal place smaller value than 10^-6. (USDC)', () => {
			const percentage = new BigNumber('0.141592653589793238462643').toNumber()
			const membership: Membership = {
				price: 1,
				currency: 'USDC',
				fee: {
					percentage,
					beneficiary: ZeroAddress,
				},
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenFee).toBe(141592n)
			expect(formatUnits(res.requiredTokenFee, 6)).toBe('0.141592')
		})
		it('should be MAX_UINT256 if the price is not defined', () => {
			const membership: Membership = {
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenFee).toBe(MaxUint256)
		})
		it('should be 0 if the percentage is not defined', () => {
			const membership: Membership = {
				price: 1,
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.requiredTokenFee).toBe(0n)
		})
		it('should be 0 if the decimal place is not found', () => {
			const membership: Membership = {
				price: 1,
				fee: { percentage: 0.1, beneficiary: ZeroAddress },
				...base,
			}
			const res = membershipToStruct(membership, 123456789)

			expect(res.requiredTokenFee).toBe(0n)
		})
	})

	describe('gateway', () => {
		const base = {
			id: 'id',
			imageSrc: 'http://image',
			name: 'name',
			description: 'description',
			payload: randomBytes(3),
		}
		it('should be fee.beneficiary', () => {
			const membership = {
				price: 100,
				currency: 'DEV',
				fee: {
					percentage: 0.123,
					beneficiary: '0x533ae9d683B10C02EbDb05471642F85230071FC3',
				},
				...base,
			} satisfies Membership
			const res = membershipToStruct(membership, 137)

			expect(res.gateway).toBe(membership.fee.beneficiary)
		})
		it('should be zero addess if the price is not defined', () => {
			const membership = {
				fee: {
					percentage: 0.123,
					beneficiary: '0x533ae9d683B10C02EbDb05471642F85230071FC3',
				},
				...base,
			} satisfies Membership
			const res = membershipToStruct(membership, 137)

			expect(res.gateway).toBe(ZeroAddress)
		})
		it('should be zero addess if the fee.beneficiary is not defined', () => {
			const membership = {
				fee: {
					percentage: 0.123,
				},
				...base,
			}
			const res = membershipToStruct(membership as unknown as Membership, 137)

			expect(res.gateway).toBe(ZeroAddress)
		})
	})

	describe('token', () => {
		const base = {
			id: 'id',
			imageSrc: 'http://image',
			name: 'name',
			description: 'description',
			payload: randomBytes(3),
		}
		describe('Polygon', () => {
			const chain = 137

			it('should be 0xA5577D1cec2583058A6Bd6d5DEAC44797c205701 (DEV)', () => {
				const membership: Membership = {
					currency: 'DEV',
					...base,
				}
				const res = membershipToStruct(membership, chain)

				expect(res.token).toBe('0xA5577D1cec2583058A6Bd6d5DEAC44797c205701')
			})
			it('should be 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619 (ETH)', () => {
				const membership: Membership = {
					currency: 'ETH',
					...base,
				}
				const res = membershipToStruct(membership, chain)

				expect(res.token).toBe('0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619')
			})
			it('should be the zero address (MATIC)', () => {
				const membership: Membership = {
					currency: 'MATIC',
					...base,
				}
				const res = membershipToStruct(membership, chain)

				expect(res.token).toBe(ZeroAddress)
			})
			it('should be 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 (USDC)', () => {
				const membership: Membership = {
					currency: 'USDC',
					...base,
				}
				const res = membershipToStruct(membership, chain)

				expect(res.token).toBe('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174')
			})
		})
		describe('Mumbai', () => {
			const chain = 80001

			it('should be 0xcbc698ed514dF6e54932a22515d6D0C27E4DA091 (DEV)', () => {
				const membership: Membership = {
					currency: 'DEV',
					...base,
				}
				const res = membershipToStruct(membership, chain)

				expect(res.token).toBe('0xcbc698ed514dF6e54932a22515d6D0C27E4DA091')
			})
			it('should be 0x3c8d6A6420C922c88577352983aFFdf7b0F977cA (ETH)', () => {
				const membership: Membership = {
					currency: 'ETH',
					...base,
				}
				const res = membershipToStruct(membership, chain)

				expect(res.token).toBe('0x3c8d6A6420C922c88577352983aFFdf7b0F977cA')
			})

			it('should be the zero address (MATIC)', () => {
				const membership: Membership = {
					currency: 'MATIC',
					...base,
				}
				const res = membershipToStruct(membership, chain)

				expect(res.token).toBe(ZeroAddress)
			})

			it('should be 0x9c3c9283d3e44854697cd22d3faa240cfb032889 (USDC)', () => {
				const membership: Membership = {
					currency: 'USDC',
					...base,
				}
				const res = membershipToStruct(membership, chain)

				expect(res.token).toBe('0xFEca406dA9727A25E71e732F9961F680059eF1F9')
			})
		})

		it('should be zero address is the currency is not defined', () => {
			const membership: Membership = {
				...base,
			}
			const res = membershipToStruct(membership, 137)

			expect(res.token).toBe(ZeroAddress)
		})
		it('should be zero address is the token is not found', () => {
			const membership: Membership = {
				currency: 'DEV',
				...base,
			}
			const res = membershipToStruct(membership, 123456789)

			expect(res.token).toBe(ZeroAddress)
		})
	})
})

describe.skip('findOfferings')
