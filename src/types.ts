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

export type ClubsPluginDetails<
	P extends ClubsFunctionPlugin = ClubsFunctionPlugin
> = ClubsPlugin &
	P &
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

export type ClubsBaseStaticPath<P = Props> = Readonly<{
	readonly layout?: unknown
	readonly props?: P
}>

export type ClubsStaticPath<P = Props> = ClubsBaseStaticPath<P> &
	Readonly<{
		readonly paths: readonly (undefined | string)[]
		readonly component: unknown
	}>

export type ClubsStaticPaths<P = Props> = readonly ClubsStaticPath<P>[]

export type ClubsFunctionGetPagePaths<P = ClubsStaticPaths> = (
	options: readonly ClubsPluginOption[],
	config: ClubsConfiguration
) => Promise<P>

export type ClubsFunctionGetAdminPaths = ClubsFunctionGetPagePaths

export type ClubsFunctionGetLayout = ClubsFunctionGetPagePaths<
	ClubsBaseStaticPath & {
		readonly layout: unknown
	}
>

export type ClubsGetStaticPathsItem<P = Props> = {
	readonly params: { readonly page: undefined | string }
	readonly props: P & {
		readonly component: unknown
		readonly layout: unknown
	}
}

export type ClubsGetStaticPathsResult<P = Props> =
	readonly ClubsGetStaticPathsItem<P>[]

export enum ClubsPluginCategory {
	Monetization = 'monetization',
	Growth = 'growth',
	Governance = 'governance',
	Uncategorized = 'uncategorized',
	Theme = 'theme',
}

export type ClubsPluginMeta = {
	readonly displayName: string
	readonly category: ClubsPluginCategory
}

export type ClubsThemePluginMeta = ClubsPluginMeta & {
	readonly theme: {
		readonly previewImage: string
	}
}

export type ClubsFunctionFactoryResult<P = Props> = {
	readonly getStaticPaths: () => Promise<ClubsGetStaticPathsResult<P>>
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

export type ClubsFunctionPageFactory<P = Props> = (
	options: ClubsFunctionPageFactoryOptions
) => ClubsFunctionFactoryResult<P>

export type ClubsFunctionAdminFactory =
	ClubsFunctionPageFactory<ClubsPropsAdminPages>

export type ClubsFunctionStandardPlugin = Readonly<{
	readonly getPagePaths: ClubsFunctionGetPagePaths
	readonly getAdminPaths: ClubsFunctionGetAdminPaths
	readonly meta: ClubsPluginMeta
}>

export type ClubsFunctionThemePlugin = Readonly<{
	readonly getPagePaths: ClubsFunctionGetPagePaths
	readonly getAdminPaths: ClubsFunctionGetAdminPaths
	readonly getLayout: ClubsFunctionGetLayout
	readonly meta: ClubsThemePluginMeta
}>

export type ClubsFunctionPlugin =
	| ClubsFunctionStandardPlugin
	| ClubsFunctionThemePlugin

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

export type ClubsAstroIntegrationOptions = undefined
