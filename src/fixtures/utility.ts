import BigNumber from 'bignumber.js'
import type { ContractRunner } from 'ethers'
import { stakeWithEth, stakeWithEthForPolygon, tokenURISim } from './dev-kit'

export const validImageUri = (path: string) => {
	const src = path.startsWith('ipfs://')
		? path.replace(/^ipfs:\/\/(.*)/, 'https://$1.ipfs.nftstorage.link/')
		: path
	return src
}

export const fetchSTokens = async (opts: {
	readonly provider: ContractRunner
	readonly tokenAddress: string
	readonly amount?: number | string
	readonly payload?: string | Uint8Array
	readonly owner?: string
}) => {
	const res = await tokenURISim(
		opts.provider,
		opts.tokenAddress,
		opts.amount,
		opts.payload,
		opts.owner
	)
	const image = res ? validImageUri(res.image) : (undefined as never)
	return { ...res, image }
}

export const fetchDevForEth = async (opts: {
	readonly provider: ContractRunner
	readonly tokenAddress: string
	readonly amount: number | string
	readonly chain?: number
}) => {
	const params = {
		provider: opts.provider,
		propertyAddress: opts.tokenAddress,
		ethAmount: new BigNumber(opts.amount).toFixed(),
	}
	const { estimatedDev } =
		opts.chain === 137 || opts.chain === 80001
			? await stakeWithEthForPolygon(params)
			: await stakeWithEth(params)
	return estimatedDev
}
