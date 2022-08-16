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
	readonly plugins: readonly ClubsPlugin[]
}>

export type ClubsStaticPath = Readonly<{
	readonly paths: readonly string[]
	readonly component: unknown
}>

export type ClubsFunctionGetPagePaths = (
	options: readonly ClubsPluginOption[],
	config: ClubsConfiguration
) => Promise<readonly ClubsStaticPath[]>

export type ClubsFunctionGetAdminPaths = ClubsFunctionGetPagePaths

export type ClubsGetStaticPathsItem = {
	readonly params: { readonly page: string; readonly nest?: string }
	readonly props: { readonly component: unknown }
}

export type ClubsGetStaticPathsResult = readonly ClubsGetStaticPathsItem[]

export type ClubsFunctionFactoryResult = {
	readonly getStaticPaths: () => ClubsGetStaticPathsResult
}

export type ClubsFunctionPageFactory = (
	fetcher: ClubsFunctionConfigFetcher
) => Promise<ClubsFunctionFactoryResult>

export type ClubsFunctionAdminFactory = ClubsFunctionPageFactory

export type ClubsFunctionPlugin = Readonly<{
	readonly getPagePaths: ClubsFunctionGetPagePaths
	readonly getAdminPaths: ClubsFunctionGetAdminPaths
}>

export type ClubsFunctionConfigFetcher = () => Promise<string>
