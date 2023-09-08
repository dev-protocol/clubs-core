/* eslint-disable */

import { BrowserProvider, type Eip1193Provider } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'
import { whenDefined } from '@devprotocol/util-ts'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { type Chain, configureChains, createConfig } from '@wagmi/core'
import { arbitrum, mainnet, polygon, polygonMumbai } from '@wagmi/core/chains'

// export const GetModalProvider = () => {
// 	const modalProvider = new Web3Modal({
// 		providerOptions: {
// 			injected: {
// 				package: detectEthereumProvider(),
// 			},
// 		},
// 		cacheProvider: true,
// 	})
// 	return modalProvider
// }

export const CHAINS: Chain[] = [arbitrum, mainnet, polygon]

export const GetModalProvider = () => {
	const projectId = '95f551c15a4b53fb5dd14cca66505708'

	const { publicClient } = configureChains(CHAINS, [w3mProvider({ projectId })])
	const wagmiConfig = createConfig({
		autoConnect: true,
		connectors: w3mConnectors({ projectId, chains: CHAINS }),
		publicClient,
	})

	const ethereumClient = new EthereumClient(wagmiConfig, CHAINS)
	return new Web3Modal({ projectId }, ethereumClient)
}

export const ReConnectWallet = async (modalProvider: any) => {
	const web3ForInjected = await detectEthereumProvider()
	if (!web3ForInjected) {
		modalProvider.clearCachedProvider()
		return {
			currentAddress: undefined,
			connectedProvider: undefined,
			provider: undefined,
		}
	}

	if (
		modalProvider.cachedProvider === 'injected' &&
		(web3ForInjected as { selectedAddress?: string }).selectedAddress
	) {
		return EthersProviderFrom(modalProvider)
	}

	return { currentAddress: undefined, provider: undefined }
}

export const EthersProviderFrom = async (modalProvider: any) => {
	const connectedProvider: Eip1193Provider = await modalProvider.connect()
	const newProvider = whenDefined(
		connectedProvider,
		(p) => new BrowserProvider(p)
	)

	const currentAddress = await (await newProvider?.getSigner())?.getAddress()
	return { currentAddress, connectedProvider, provider: newProvider }
}

export const Disconnect = (modalProvider: any) => {
	modalProvider?.clearCachedProvider()
}
