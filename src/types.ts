import { Props } from 'astro'

export type ClubsPluginOptionValue =
	| string
	| number
	| boolean
	| Date
	| bigint
	| Uint8Array
	| readonly ClubsPluginOptionValue[]
	| {
			readonly [key: string]: ClubsPluginOptionValue
	  }

export type ClubsPluginOption = Readonly<{
	readonly key: string
	readonly value?: ClubsPluginOptionValue
}>

export type ClubsPluginOptions = readonly ClubsPluginOption[]

export type ClubsPlugin = Readonly<{
	readonly name: string
	readonly enable?: boolean
	readonly options: ClubsPluginOptions
}>

export type ClubsPluginDetails = ClubsPlugin &
	ClubsFunctionPlugin &
	Readonly<{
		readonly pluginIndex: number
	}>

export type ClubsConfiguration = Readonly<{
	readonly name: string
	readonly twitterHandle: string
	readonly description: string
	readonly url: string
	readonly propertyAddress: string
	readonly adminRolePoints: number
	readonly chainId: number
	readonly rpcUrl: string
	readonly options?: ClubsPluginOptions
	readonly plugins: readonly ClubsPlugin[]
}>

export type ClubsStaticPath = Readonly<{
	readonly paths: readonly (undefined | string)[]
	readonly component: unknown
	readonly props?: Props
}>

export type ClubsStaticPaths = readonly ClubsStaticPath[]

export type ClubsFunctionGetPagePaths = (
	options: readonly ClubsPluginOption[],
	config: ClubsConfiguration
) => Promise<ClubsStaticPaths>

export type ClubsFunctionGetAdminPaths = ClubsFunctionGetPagePaths

export type ClubsGetStaticPathsItem = {
	readonly params: { readonly page: undefined | string }
	readonly props: Props & { readonly component: unknown }
}

export type ClubsGetStaticPathsResult = readonly ClubsGetStaticPathsItem[]

export type ClubsPluginMeta = { readonly displayName: string }

export type ClubsFunctionFactoryResult = {
	readonly getStaticPaths: () => Promise<ClubsGetStaticPathsResult>
	readonly getCurrentConfig: () => Promise<ClubsConfiguration>
}

export type ClubsPluginsMap = {
	readonly [name: string]: ClubsFunctionPlugin
}

export type ClubsFunctionPageFactoryOptions = {
	readonly config: ClubsFunctionConfigFetcher
	readonly plugins: ClubsPluginsMap
}

export type ClubsFunctionOnSubmitConfiguration = (
	encodedConfig: string
) => Promise<void | Error>

export type ClubsPropsAdmin = {
	readonly onSubmit: ClubsFunctionOnSubmitConfiguration
}

export type ClubsFunctionPageFactory = (
	options: ClubsFunctionPageFactoryOptions
) => ClubsFunctionFactoryResult

export type ClubsFunctionAdminFactory = ClubsFunctionPageFactory

export type ClubsFunctionPlugin = Readonly<{
	readonly getPagePaths: ClubsFunctionGetPagePaths
	readonly getAdminPaths: ClubsFunctionGetAdminPaths
	readonly meta: ClubsPluginMeta
}>

export type ClubsFunctionConfigFetcher = () => string | Promise<string>

export type ClubsFunctionPluginOptionSetter = <T extends ClubsPluginOptions>(
	nextOptions: T
) => T

export type ClubsFunctionClubsConfigurationSetter = <
	T extends ClubsConfiguration
>(
	nextConfiguration: T
) => T

export type ClubsPropsClubsPlugin = Omit<
	ClubsPluginDetails,
	'getPagePaths' | 'getAdminPaths'
> & {
	readonly paths: ClubsStaticPaths
	readonly page: string
	readonly pathname: string
}

export type ClubsPropsAdminPages = Props & {
	readonly clubs: {
		readonly currentPluginIndex: number
		readonly encodedClubsConfiguration: string
		readonly plugins: ReadonlyArray<ClubsPropsClubsPlugin>
	}
}

export enum ClubsEvents {
	UpdatePluginOptions = 'clubs:update_plugin_options',
	UpdateConfiguration = 'clubs:update_configuration',
	BuildConfiguration = 'clubs:build_configuration',
	SubmitConfiguration = 'clubs:submit_configuration',
	FinishConfiguration = 'clubs:submit_finish_configuration',
}

export type ClubsEventsDetailUpdatePluginOptions = {
	readonly data: ClubsPluginOptions
	readonly pluginIndex: number
}

export type ClubsEventsDetailUpdateConfiguration = {
	readonly data: ClubsConfiguration
}

export type ClubsEventsDetailBuildConfiguration = undefined

export type ClubsEventsDetailSubmitConfiguration = {
	readonly data: string
}

export type ClubsEventsDetailFinishConfiguration = {
	readonly success: boolean
	readonly error?: Error
}

export type ClubsEventsUpdatePluginOptions =
	CustomEvent<ClubsEventsDetailUpdatePluginOptions>
export type ClubsEventsUpdateConfiguration =
	CustomEvent<ClubsEventsDetailUpdateConfiguration>
export type ClubsEventsBuildConfiguration =
	CustomEvent<ClubsEventsDetailBuildConfiguration>
export type ClubsEventsSubmitConfiguration =
	CustomEvent<ClubsEventsDetailSubmitConfiguration>
export type ClubsEventsFinishConfiguration =
	CustomEvent<ClubsEventsDetailFinishConfiguration>
