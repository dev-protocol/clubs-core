import { clientsProperty } from '@devprotocol/dev-kit'
import { BigNumber, providers, utils } from 'ethers'
import { decode } from '../decode'

export type ClubsFunctionAuthenticationAdminParams = {
	readonly signature: string
	readonly message: string
	readonly previousConfiguration: string
	readonly provider: providers.BaseProvider
}

export const authenticate = async ({
	message,
	signature,
	previousConfiguration,
	provider,
}: ClubsFunctionAuthenticationAdminParams) => {
	const digest = utils.hashMessage(message)
	const address = utils.recoverAddress(digest, signature)
	const previousConfig = decode(previousConfiguration)

	const propertyClient = await clientsProperty(
		provider,
		previousConfig.propertyAddress
	)
	const property = propertyClient[0] ?? propertyClient[1]
	const totalSupply = BigNumber.from(await property?.totalSupply())
	const userBalance = BigNumber.from(await property?.balanceOf(address))

	const userShare = userBalance.div(totalSupply).toNumber()
	return userShare >= previousConfig.adminRolePoints
}
