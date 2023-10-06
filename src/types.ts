import type { APIRoute, Props } from 'astro'
import type { AstroComponentFactory } from 'astro/dist/runtime/server'

export type ClubsGeneralUnit =
	| string
	| number
	| boolean
	| Date
	| bigint
	| Uint8Array
	| readonly ClubsGeneralUnit[]
	| {
			readonly [key: string]: ClubsGeneralUnit
	  }

export type ClubsPluginOptionValue = ClubsGeneralUnit

export type ClubsPluginOption = Readonly<{
	readonly key: string
	readonly value?: ClubsPluginOptionValue
}>

export type ClubsPluginOptions = readonly ClubsPluginOption[]

export type ClubsPlugin = Readonly<{
	readonly id: string
	readonly name?: string // TODO: This value is used in historical reason, and will be deleted in the future
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
	readonly layout?: AstroComponentFactory
	readonly props?: P
}>

export type ClubsStaticPath<P = Props> = ClubsBaseStaticPath<P> &
	Readonly<{
		readonly paths: readonly (undefined | string)[]
		readonly component: AstroComponentFactory
	}>

export type ClubsApiPath = Readonly<{
	readonly paths: readonly (undefined | string)[]
	readonly method:
		| 'CONNECT'
		| 'DELETE'
		| 'GET'
		| 'HEAD'
		| 'OPTIONS'
		| 'POST'
		| 'PUT'
		| 'PATCH'
	readonly handler: APIRoute
}>

export type ClubsApiPaths = readonly ClubsApiPath[]

export enum ClubsSlotName {
	AdminBodyBeforeContents = 'admin:body:before-contents',
	AdminBodyAfterContents = 'admin:body:after-contents',
	AdminSidebarBeforeTitle = 'admin:sidebar:before-title',
	AdminAsideAfterBuiltInButtons = 'admin:aside:after-built-in-buttons',
	AdminModalCcontent = 'admin:modal:content',
	AdminSidebarBeforeOverviewLink = 'admin:sidebar:before-overview-link',
	AdminSidebarBeforeThemeLink = 'admin:sidebar:before-theme-link',
	AdminSidebarAfterBuiltInPrimaryLinks = 'admin:sidebar:after-built-in-primary-links',
	PageContentHomeBeforeContent = 'page:content:home:before-content',
	PageContentHomeAfterContent = 'page:content:home:after-content',
	PageContentAnywhereBeforeContent = 'page:content:anywhere:before-content',
	PageContentAnywhereAfterContent = 'page:content:anywhere:after-content',
	ConnectButton = 'clubs:connect-button',
}

export type ClubsSlot = {
	readonly slot: ClubsSlotName | string
	readonly component: AstroComponentFactory
	readonly order?: number
	readonly props?: Props
}

export type ClubsSlots = readonly ClubsSlot[]

export type ClubsFunctionGetSlotsResults = ClubsSlots

export type ClubsStaticPaths<P = Props> = readonly ClubsStaticPath<P>[]

export type ClubsFunctionGetPluginConfigById = (
	id: string
) => readonly [ClubsPlugin, number] | readonly [undefined, undefined]

export type ClubsFactoryUtils = {
	readonly getPluginConfigById: ClubsFunctionGetPluginConfigById
}

export type ClubsSlotsFactoryUtils = ClubsFactoryUtils & {
	readonly paths: readonly (undefined | string)[]
	readonly factory: 'page' | 'admin'
}

export type ClubsFunctionGetPagePaths<
	P = ClubsStaticPaths<
		Props & {
			readonly signals?: readonly (ClubsPluginSignal | string)[]
		}
	>
> = (
	options: readonly ClubsPluginOption[],
	config: ClubsConfiguration,
	utils: ClubsFactoryUtils
) => Promise<P>

export type ClubsFunctionGetAdminPaths = ClubsFunctionGetPagePaths<
	ReadonlyArray<ClubsStaticPath>
>

export type ClubsFunctionGetLayout = ClubsFunctionGetPagePaths<
	ClubsBaseStaticPath & {
		readonly layout: AstroComponentFactory
	}
>

export type ClubsFunctionGetSlots = (
	options: readonly ClubsPluginOption[],
	config: ClubsConfiguration,
	utils: ClubsSlotsFactoryUtils
) => Promise<ClubsFunctionGetSlotsResults>

/**
 * Fetch the internal API Paths for the plugin. Logic would be placed in the /api directory inside of your plugin.
 *
 * getApiPaths is an asynchronous function that generates API endpoints and returns an array of ClubsApiPath to define API endpoints and their behavior, etc.
 *
 * @param {	options: readonly ClubsPluginOption[], config: ClubsConfiguration} options
 * @param {ClubsConfiguration} config
 * @param {ClubsFactoryUtils} utils
 *
 * @returns {Promise<ClubsApiPaths>} An array of objects containing 'paths', 'method', and 'handler' properties.
 *
 * @example
 *
 * ```ts
	export const getApiPaths: ClubsFunctionGetApiPaths = async (
		options,
		{ propertyAddress, rpcUrl },
		utils
	) => {
		const [{ get }, { post }] = await Promise.all([
			import('./api/get'),
			import('./api/post'),
		])

		return [
			{
				paths: ['tickets'],
				method: 'GET' as 'GET',
				handler: get({ tickets, propertyAddress }),
			},
			{
				paths: ['tickets', 'create],
				method: 'POST' as 'POST',
				handler: post({ tickets, propertyAddress }),
			},
		]
	}
 * ```
 */
export type ClubsFunctionGetApiPaths = ClubsFunctionGetPagePaths<ClubsApiPaths>

export type ClubsGetStaticPathsItem<P = Props> = {
	readonly params: { readonly page: undefined | string }
	readonly props: P & {
		readonly component: AstroComponentFactory
		readonly layout: AstroComponentFactory
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

export enum ClubsPluginSignal {
	DisplayWideWidth = 'display:wide-width',
	DisplayFullWidth = 'display:full-width',
	DisplayFullPage = 'display:full-page',
}

export type ClubsPluginToken = Omit<
	ClubsConfiguration,
	| 'name'
	| 'twitterHandle'
	| 'description'
	| 'url'
	| 'adminRolePoints'
	| 'rpcUrl'
	| 'options'
	| 'plugins'
>

// Ref.: https://schema.org/Offer
export type ClubsPluginOffer = {
	readonly price?: 0
	readonly priceCurrency?: 'ETH' | 'DEV'
	readonly requiredSTokens?: {
		readonly payload?: Uint8Array | string
	}
}

export type ClubsPluginMeta = {
	readonly id: string
	readonly displayName: string
	readonly category: ClubsPluginCategory | string
	readonly token?: ClubsPluginToken
	readonly offer?: ClubsPluginOffer
	readonly icon?: string
	readonly previewImages?: readonly string[]
	readonly description?: string
	readonly readme?: AstroComponentFactory
	readonly clubsUrl?: string
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

export type ClubsPlugins = readonly ClubsFunctionPlugin[]

export type ClubsFunctionPageFactoryOptions = {
	readonly config: ClubsFunctionConfigFetcher
	readonly plugins: ClubsPlugins
}

export type ClubsFunctionOnSubmitConfiguration = (
	encodedConfig: string
) => Promise<void | Error>

export type ClubsFunctionPageFactory<P = Props> = (
	options: ClubsFunctionPageFactoryOptions
) => ClubsFunctionFactoryResult<P>

export type ClubsFunctionAdminFactory =
	ClubsFunctionPageFactory<ClubsPropsAdminPages>

export type ClubsFunctionApiFactory = (
	options: ClubsFunctionPageFactoryOptions
) => { readonly all: APIRoute }

export type ClubsFunctionStandardPlugin = Readonly<{
	readonly getPagePaths?: ClubsFunctionGetPagePaths
	readonly getAdminPaths?: ClubsFunctionGetAdminPaths
	readonly getSlots?: ClubsFunctionGetSlots
	readonly getApiPaths?: ClubsFunctionGetApiPaths
	readonly meta: ClubsPluginMeta
}>

export type ClubsFunctionThemePlugin = Readonly<{
	readonly getPagePaths?: ClubsFunctionGetPagePaths
	readonly getAdminPaths?: ClubsFunctionGetAdminPaths
	readonly getLayout: ClubsFunctionGetLayout
	readonly getSlots?: ClubsFunctionGetSlots
	readonly getApiPaths?: ClubsFunctionGetApiPaths
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

export type ClubsPropsPages = Props & {
	readonly clubs: {
		readonly slots: ClubsFunctionGetSlotsResults
	}
}

export type ClubsPropsAdminPages = Props & {
	readonly clubs: {
		readonly currentPluginIndex: number
		readonly encodedClubsConfiguration: string
		readonly plugins: ReadonlyArray<ClubsPropsClubsPlugin>
		readonly slots: ClubsFunctionGetSlotsResults
	}
}

export enum ClubsEvents {
	UpdatePluginOptions = 'clubs:update_plugin_options',
	UpdatedPluginOptions = 'clubs:updated_plugin_options',
	UpdateConfiguration = 'clubs:update_configuration',
	UpdatedConfiguration = 'clubs:updated_configuration',
	BuildConfiguration = 'clubs:build_configuration',
	SubmitConfiguration = 'clubs:submit_configuration',
	FinishConfiguration = 'clubs:submit_finish_configuration',
	ControlModal = 'clubs:control_modal',
}

export type ClubsEventsDetailUpdatePluginOptions = {
	readonly data: ClubsPluginOptions
	readonly pluginIndex: number
}

export type ClubsEventsDetailUpdatedPluginOptions = {
	readonly pluginIndex?: number
	readonly success: boolean
	readonly error?: Error
}

export type ClubsEventsDetailUpdateConfiguration = {
	readonly data: ClubsConfiguration
}

export type ClubsEventsDetailUpdatedConfiguration = {
	readonly success: boolean
	readonly error?: Error
}

export type ClubsEventsDetailBuildConfiguration = undefined

export type ClubsEventsDetailSubmitConfiguration = {
	readonly data: string
}

export type ClubsEventsDetailFinishConfiguration = {
	readonly success: boolean
	readonly error?: Error
}

export type ClubsEventsDetailControlModal = {
	readonly open: boolean
	readonly state?: 'loading' | 'alert'
	readonly blocks?: boolean
	readonly closeButton?: {
		readonly label: string
	}
}

export type ClubsEventsUpdatePluginOptions =
	CustomEvent<ClubsEventsDetailUpdatePluginOptions>
export type ClubsEventsUpdatedPluginOptions =
	CustomEvent<ClubsEventsDetailUpdatedPluginOptions>
export type ClubsEventsUpdateConfiguration =
	CustomEvent<ClubsEventsDetailUpdateConfiguration>
export type ClubsEventsUpdatedConfiguration =
	CustomEvent<ClubsEventsDetailUpdatedConfiguration>
export type ClubsEventsBuildConfiguration =
	CustomEvent<ClubsEventsDetailBuildConfiguration>
export type ClubsEventsSubmitConfiguration =
	CustomEvent<ClubsEventsDetailSubmitConfiguration>
export type ClubsEventsFinishConfiguration =
	CustomEvent<ClubsEventsDetailFinishConfiguration>
export type ClubsEventsControlModal = CustomEvent<ClubsEventsDetailControlModal>

export type ClubsAstroIntegrationOptions = undefined

/**
 * The profile of a user
 */
export type ClubsProfile = {
	readonly avatar: string
	readonly username: string
}

export type ClubsNavigationLink = {
	readonly display: string
	readonly path: string
	readonly enable?: boolean
	readonly kind?: string
}
