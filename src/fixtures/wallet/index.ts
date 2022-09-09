/* eslint-disable */

import { providers } from 'ethers'
import Web3Modal from 'web3modal'
import detectEthereumProvider from '@metamask/detect-provider'
import { whenDefined } from '@devprotocol/util-ts'

export const GetModalProvider = () => {
	const modalProvider = new Web3Modal({
		providerOptions: {
			injected: {
				package: detectEthereumProvider(),
			},
		},
		cacheProvider: true,
	})
	return modalProvider
}

export const ReConnectWallet = async (modalProvider: Web3Modal) => {
	const web3ForInjected = await detectEthereumProvider()
	if (!web3ForInjected) {
		modalProvider.clearCachedProvider()
		return { currentAddress: undefined, provider: undefined }
	}

	if (
		modalProvider.cachedProvider === 'injected' &&
		web3ForInjected.selectedAddress
	) {
		const connectedProvider = await modalProvider.connect()
		const newProvider = whenDefined(
			connectedProvider,
			(p) => new providers.Web3Provider(p)
		)

		const currentAddress = await newProvider?.getSigner().getAddress()
		return { currentAddress, provider: newProvider }
	}

	return { currentAddress: undefined, provider: undefined }
}

export const Disconnect = (modalProvider: any) => {
	modalProvider?.clearCachedProvider()
}
