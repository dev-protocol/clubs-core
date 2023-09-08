/* eslint-disable */

import { BrowserProvider, type Eip1193Provider } from 'ethers'
import detectEthereumProvider from '@metamask/detect-provider'
import { whenDefined } from '@devprotocol/util-ts'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { type Chain, configureChains, createConfig } from '@wagmi/core'
import { arbitrum, mainnet, polygon, polygonMumbai } from '@wagmi/core/chains'
import { getEthersProvider } from './ethers'

const { PUBLIC_WALLET_CONNECT_PROJECT_ID: projectId } = import.meta.env

export const CHAINS: Chain[] = [arbitrum, mainnet, polygon, polygonMumbai]

export const GetModalProvider = () => {
	const { publicClient } = configureChains(CHAINS, [w3mProvider({ projectId })])
	const wagmiConfig = createConfig({
		autoConnect: true,
		connectors: w3mConnectors({ projectId, chains: CHAINS }),
		publicClient,
	})

	const ethereumClient = new EthereumClient(wagmiConfig, CHAINS)
	return new Web3Modal({ projectId }, ethereumClient)
}

export const ReConnectWallet = async (chainId: number) => {
	const provider = getEthersProvider({ chainId: chainId || 1 })
	if (provider) {
		// TODO: fix `EthersProviderFrom` to use new Web3Modal
		return EthersProviderFrom(provider)
	}

	return {
		currentAddress: undefined,
		provider: undefined,
		connectedProvider: undefined,
	}
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
