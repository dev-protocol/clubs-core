import { clientsProperty } from '@devprotocol/dev-kit'
import { BigNumber, constants, providers, utils } from 'ethers'
import { decode } from './decode'

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

	// eslint-disable-next-line functional/no-conditional-statement
	if (!propertyClient || propertyClient.length <= 0) {
		return false
	}

	const property = propertyClient[0] ?? propertyClient[1]
	const totalSupply = BigNumber.from(await property?.totalSupply())
	const userBalance = BigNumber.from(await property?.balanceOf(address))

	const userShare = Number(
		// Parsing (balance * 1e18 / supply) with 1e16
		utils.formatUnits(
			userBalance.mul(constants.WeiPerEther).div(totalSupply),
			16
		)
	)

	return userShare >= previousConfig.adminRolePoints
}
