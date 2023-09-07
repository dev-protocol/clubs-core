/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/functional-parameters */
import React, { useEffect, useMemo } from 'react'
import { useWeb3Modal } from '@web3modal/react'
import { useWalletClient, usePublicClient, useAccount } from 'wagmi'
import { whenDefined } from '@devprotocol/util-ts'
import { combineLatest } from 'rxjs'
import { BrowserProvider } from 'ethers'

export type ConnectButtonProps = {
	readonly label?: string
	readonly className?: string
	readonly overrideClassName?: string
}

const truncateEthAddress = (address: string) => {
	const match = address.match(
		/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
	)
	return !match ? address : `${match[1]}\u2026${match[2]}`
}

export const ConnectButton = ({
	label,
	className,
	overrideClassName,
}: ConnectButtonProps) => {
	const { open } = useWeb3Modal()
	const { data: walletClient, isError, isLoading } = useWalletClient()
	const publicClient = usePublicClient()
	const { address } = useAccount()
	const truncatedEthAddress = useMemo(
		() => whenDefined(address, truncateEthAddress),
		[address]
	)

	useEffect(() => {
		;(async () => {
			const { connection } = await import('../connection')
			whenDefined(walletClient, (wallet) =>
				connection().setEip1193Provider(wallet, BrowserProvider)
			)
		})()
	})

	console.log({ walletClient, publicClient })

	return (
		<button
			data-is-loading={isLoading}
			data-is-error={Boolean(isError)}
			className={
				overrideClassName
					? overrideClassName
					: `hs-button is-filled is-large is-fullwidth data-[is-loading=true]:animate-pulse data-[is-error=true]:bg-red-600 ${
							className ? className : ''
					  }`
			}
			onClick={() => open()}
		>
			<span className="hs-button__label">
				{truncatedEthAddress ? truncatedEthAddress : label ? label : 'Connect'}
			</span>
		</button>
	)
}
