/* eslint-disable */

import { type HttpTransport } from 'viem'
import {
	FallbackProvider,
	JsonRpcProvider,
	BrowserProvider,
	JsonRpcSigner,
} from 'ethers'
import {
	type PublicClient,
	getPublicClient,
	getWalletClient,
	type WalletClient,
} from '@wagmi/core'

export function publicClientToProvider(publicClient: PublicClient) {
	const { chain, transport } = publicClient
	const network = {
		chainId: chain.id,
		name: chain.name,
		ensAddress: chain.contracts?.ensRegistry?.address,
	}
	if (transport.type === 'fallback') {
		const providers = (
			transport.transports as readonly ReturnType<HttpTransport>[]
		).map(({ value }) => new JsonRpcProvider(value?.url, network))
		if (providers.length === 1) return providers[0]
		return new FallbackProvider(providers)
	}
	return new JsonRpcProvider(transport.url, network)
}

/** Action to convert a viem Public Client to an ethers.js Provider. */
export function getEthersProvider({
	chainId,
}: { readonly chainId?: number } = {}) {
	const publicClient = getPublicClient({ chainId })
	return publicClientToProvider(publicClient)
}

export function walletClientToSigner(walletClient: WalletClient) {
	const { account, chain, transport } = walletClient
	const network = {
		chainId: chain.id,
		name: chain.name,
		ensAddress: chain.contracts?.ensRegistry?.address,
	}
	const provider = new BrowserProvider(transport, network)
	const signer = new JsonRpcSigner(provider, account.address)
	return signer
}

/** Action to convert a viem Wallet Client to an ethers.js Signer. */
export async function getEthersSigner({
	chainId,
}: { readonly chainId?: number } = {}) {
	const walletClient = await getWalletClient({ chainId })
	if (!walletClient) return undefined
	return walletClientToSigner(walletClient)
}
