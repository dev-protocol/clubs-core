import {
	WeiPerEther,
	type ContractRunner,
	hashMessage,
	recoverAddress,
	formatUnits,
	type AbstractProvider,
} from 'ethers'
import { decode } from './decode'
import { clientsProperty } from '@devprotocol/dev-kit/agent'
import { ClubsConfiguration } from './types'

export type ClubsFunctionAuthenticationAdminParams = {
	readonly signature: string
	readonly message: string
	readonly previousConfiguration: string
	readonly provider: AbstractProvider | ContractRunner
}

export const authenticate = async ({
	message,
	signature,
	previousConfiguration,
	provider,
}: ClubsFunctionAuthenticationAdminParams) => {
	const digest = hashMessage(message)
	const address = recoverAddress(digest, signature)
	const previousConfig = decode(previousConfiguration)

	const propertyClient = await clientsProperty(
		provider,
		previousConfig.propertyAddress
	)

	if (!propertyClient || propertyClient.length <= 0) {
		return false
	}

	const property = propertyClient[0] ?? propertyClient[1]
	const totalSupply = BigInt((await property?.totalSupply()) ?? 0)
	const userBalance = BigInt((await property?.balanceOf(address)) ?? 0)

	const userShare = Number(
		// Parsing (balance * 1e18 / supply) with 1e16
		formatUnits((userBalance * WeiPerEther) / totalSupply, 16)
	)

	return userShare >= previousConfig.adminRolePoints
}

export const isAdmin = async ({
	address,
	previousConfiguration,
	provider,
}: {
	readonly address: string
	readonly previousConfiguration: ClubsConfiguration
	readonly provider: AbstractProvider | ContractRunner
}) => {
	const propertyClient = await clientsProperty(
		provider,
		previousConfiguration.propertyAddress
	)

	if (!propertyClient || propertyClient.length <= 0) {
		return false
	}

	const property = propertyClient[0] ?? propertyClient[1]
	const totalSupply = BigInt((await property?.totalSupply()) ?? 0)
	const userBalance = BigInt((await property?.balanceOf(address)) ?? 0)

	const userShare = Number(
		// Parsing (balance * 1e18 / supply) with 1e16
		formatUnits((userBalance * WeiPerEther) / totalSupply, 16)
	)

	return userShare >= previousConfiguration.adminRolePoints
}
