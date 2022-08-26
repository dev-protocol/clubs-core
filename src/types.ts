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

export type ClubsPlugin = Readonly<{
	readonly name: string
	readonly path?: string
	readonly enable?: boolean
	readonly options: readonly ClubsPluginOption[]
}>

export type ClubsConfiguration = Readonly<{
	readonly id: string
	readonly name: string
	readonly twitterHandle: string
	readonly description: string
	readonly url: string
	readonly propertyAddress: string
	readonly plugins: readonly ClubsPlugin[]
}>

export type ClubsStaticPath = Readonly<{
	readonly paths: readonly (undefined | string)[]
	readonly component: unknown
	readonly props?: Props
}>

export type ClubsFunctionGetPagePaths = (
	options: readonly ClubsPluginOption[],
	config: ClubsConfiguration
) => Promise<readonly ClubsStaticPath[]>

export type ClubsFunctionGetAdminPaths = ClubsFunctionGetPagePaths

export type ClubsGetStaticPathsItem = {
	readonly params: { readonly page: undefined | string }
	readonly props: Props & { readonly component: unknown }
}

export type ClubsGetStaticPathsResult = readonly ClubsGetStaticPathsItem[]

export type ClubsFunctionFactoryResult = {
	readonly getStaticPaths: () => ClubsGetStaticPathsResult
}

export type ClubsPluginsMap = {
	readonly [name: string]: ClubsFunctionPlugin
}

export type ClubsFunctionPageFactoryOptions = {
	readonly config: ClubsFunctionConfigFetcher
	readonly plugins: ClubsPluginsMap
}

export type ClubsFunctionPageFactory = (
	options: ClubsFunctionPageFactoryOptions
) => Promise<ClubsFunctionFactoryResult>

export type ClubsFunctionAdminFactory = ClubsFunctionPageFactory

export type ClubsFunctionPlugin = Readonly<{
	readonly getPagePaths: ClubsFunctionGetPagePaths
	readonly getAdminPaths: ClubsFunctionGetAdminPaths
}>

export type ClubsFunctionConfigFetcher = () => string | Promise<string>
