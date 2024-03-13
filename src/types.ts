import type {
	APIRoute,
	GetStaticPathsOptions,
	ImageMetadata,
	Props,
} from 'astro'
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
	readonly adminPageVisibility?: 'public' | 'private'
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

export type ClubsBaseStaticPath<P extends Props = Props> = Readonly<{
	readonly layout?: AstroComponentFactory
	readonly props?: P
}>

export type ClubsStaticPath<P extends Props = Props> = ClubsBaseStaticPath<P> &
	Readonly<{
		readonly paths: readonly (undefined | string | RegExp)[]
		readonly component: AstroComponentFactory
	}>

export type ClubsApiPath = Readonly<{
	readonly paths: readonly (undefined | string | RegExp)[]
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

export type ClubsSlot<P extends Props = Props> = {
	readonly slot: ClubsSlotName | string
	readonly component: AstroComponentFactory
	readonly order?: number
	readonly props?: P
}

export type ClubsSlots<P extends Props = Props> = readonly ClubsSlot<P>[]

export type ClubsFunctionGetSlotsResults<P extends Props = Props> =
	ClubsSlots<P>

export type ClubsStaticPaths<P extends Props = Props> =
	readonly ClubsStaticPath<P>[]

export type ClubsFunctionGetPluginConfigById = (
	id: string
) => readonly [ClubsPlugin, number] | readonly [undefined, undefined]

export type ClubsFactoryUtils = {
	readonly getPluginConfigById: ClubsFunctionGetPluginConfigById
}

export type ClubsSlotsFactoryUtils = ClubsFactoryUtils & {
	readonly paths: readonly (undefined | string | RegExp)[]
	readonly factory: 'page' | 'admin'
}

export type ClubsFunctionGetPagePaths<P extends Props = Props> = (
	options: readonly ClubsPluginOption[],
	config: ClubsConfiguration,
	utils: ClubsFactoryUtils
) => Promise<
	ClubsStaticPaths<
		P & {
			readonly signals?: readonly (ClubsPluginSignal | string)[]
		}
	>
>

export type ClubsFunctionGetAdminPaths<P extends Props = Props> =
	ClubsFunctionGetPagePaths<P>

export type ClubsFunctionGetLayout<P extends Props = Props> = (
	options: readonly ClubsPluginOption[],
	config: ClubsConfiguration,
	utils: ClubsFactoryUtils
) => Promise<
	Omit<ClubsBaseStaticPath<P>, 'layout'> & {
		readonly layout: AstroComponentFactory
	}
>

export type ClubsFunctionGetSlots<P extends Props = Props> = (
	options: readonly ClubsPluginOption[],
	config: ClubsConfiguration,
	utils: ClubsSlotsFactoryUtils
) => Promise<ClubsFunctionGetSlotsResults<P>>

/**
 * Fetch the internal API Paths for the plugin. Logic would be placed in the /api directory inside of your plugin.
 *
 * getApiPaths is an asynchronous function that generates API endpoints and returns an array of ClubsApiPath to define API endpoints and their behavior, etc.
 *
 * @param {options: readonly ClubsPluginOption[], config: ClubsConfiguration} options
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
export type ClubsFunctionGetApiPaths = (
	options: readonly ClubsPluginOption[],
	config: ClubsConfiguration,
	utils: ClubsFactoryUtils
) => Promise<ClubsApiPaths>

export type ClubsGetStaticPathsItem<P extends Props = Props> = {
	readonly params: { readonly page: undefined | string }
} & {
	readonly props: ClubsPropsPages<P>
}

export type ClubsGetStaticPathsResult<
	P extends Props = Props,
	SP extends Props = Props
	/* eslint-disable functional/prefer-readonly-type */
> = ClubsGetStaticPathsItem<
	ClubsPropsPages<P, SP> & {
		readonly component: AstroComponentFactory
		readonly layout: AstroComponentFactory
	}
>[]

export type ClubsGetStaticPathsAdminResult<
	P extends Props = Props,
	SP extends Props = Props
	/* eslint-disable functional/prefer-readonly-type */
> = ClubsGetStaticPathsItem<
	ClubsPropsPages<ClubsPropsAdminPages<P>, SP> & {
		readonly component: AstroComponentFactory
		readonly layout?: AstroComponentFactory
	}
>[]

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
	readonly icon?: string | ImageMetadata
	readonly previewImages?: readonly (string | ImageMetadata)[]
	readonly description?: string
	readonly readme?: AstroComponentFactory
	readonly clubsUrl?: string
}

export type ClubsThemePluginMeta = ClubsPluginMeta & {
	readonly theme: {
		readonly previewImage: string
	}
}

export type ClubsFunctionFactoryResult<T> = {
	readonly getStaticPaths: (opts?: GetStaticPathsOptions) => Promise<T>
	readonly getCurrentConfig: () => Promise<ClubsConfiguration>
}

export type ClubsFunctionApiFactoryResult = { readonly ALL: APIRoute }

export type ClubsFunctionPageFactoryResult<
	O extends ClubsFunctionFactoryOptions = ClubsFunctionFactoryOptions
> = ClubsFunctionFactoryResult<
	ClubsGetStaticPathsResult<
		ClubsInferFactoryPropsType<
			O extends { plugins: infer P } ? P : never,
			'getPagePaths'
		> &
			ClubsInferFactoryPropsType<
				O extends { plugins: infer P } ? P : never,
				'getLayout'
			> & { readonly signals?: readonly (ClubsPluginSignal | string)[] },
		ClubsInferFactoryPropsType<
			O extends { plugins: infer P } ? P : never,
			'getSlots'
		>
	>
>

export type ClubsFunctionAdminFactoryResult<
	O extends ClubsFunctionFactoryOptions = ClubsFunctionFactoryOptions
> = ClubsFunctionFactoryResult<
	ClubsGetStaticPathsAdminResult<
		ClubsInferFactoryPropsType<
			O extends { plugins: infer P } ? P : never,
			'getAdminPaths'
		> &
			ClubsInferFactoryPropsType<
				O extends { plugins: infer P } ? P : never,
				'getLayout'
			>
	>
>

export type ClubsPlugins = readonly ClubsFunctionPlugin[]

export type ClubsFunctionFactoryOptions = {
	readonly config: ClubsFunctionConfigFetcher
	readonly plugins: ClubsPlugins
}

export type ClubsFunctionOnSubmitConfiguration = (
	encodedConfig: string
) => Promise<void | Error>

export type ClubsInferFactoryPropsType<
	T extends ClubsPlugins,
	F extends keyof Omit<ClubsFunctionPlugin, 'getApiPaths' | 'meta'>
> = T extends Array<infer P> | ReadonlyArray<infer P>
	? P extends ClubsFunctionPlugin
		? P[F] extends
				| ClubsFunctionGetPagePaths
				| ClubsFunctionGetAdminPaths
				| ClubsFunctionGetSlots
				| ClubsFunctionGetLayout
				| undefined
			? P[F] extends ((...args: any) => Promise<infer U>) | undefined
				? U extends
						| Array<{ props?: infer V }>
						| ReadonlyArray<{ props?: infer V }>
						| { props?: infer V }
					? V
					: Props
				: Props
			: Props
		: Props
	: Props

export type ClubsFunctionPageFactory<
	O extends ClubsFunctionFactoryOptions = ClubsFunctionFactoryOptions
> = (options: O) => ClubsFunctionPageFactoryResult<O>

export type ClubsFunctionAdminFactory<
	O extends ClubsFunctionFactoryOptions = ClubsFunctionFactoryOptions
> = (options: O) => ClubsFunctionAdminFactoryResult<O>

export type ClubsFunctionApiFactory = (
	options: ClubsFunctionFactoryOptions
) => ClubsFunctionApiFactoryResult

export type ClubsFunctionStandardPlugin = Readonly<{
	readonly getPagePaths?: ClubsFunctionGetPagePaths
	readonly getAdminPaths?: ClubsFunctionGetAdminPaths
	readonly getLayout?: ClubsFunctionGetLayout
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

export type ClubsPropsPages<
	P extends Props = Props,
	SP extends Props = Props
> = P & {
	readonly clubs: {
		readonly slots: ClubsFunctionGetSlotsResults<SP>
	}
}

export type ClubsPropsAdminPages<P extends Props = Props> = P & {
	readonly clubs: {
		readonly currentPluginIndex: number
		readonly encodedClubsConfiguration: string
		readonly plugins: ReadonlyArray<ClubsPropsClubsPlugin>
		readonly slots: ClubsFunctionGetSlotsResults
	}
}

export enum ClubsPreferredColorScheme {
	System = 'system',
	Light = 'light',
	Dark = 'dark',
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
	UpdatePreferredColorScheme = 'clubs:updated_preferred_color_scheme',
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

export type ClubsEventsDetailUpdatePreferredColorScheme = {
	readonly theme: ClubsPreferredColorScheme
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
export type ClubsEventsUpdatePreferredColorScheme =
	CustomEvent<ClubsEventsDetailUpdatePreferredColorScheme>

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

export type Membership = {
	readonly id: string
	readonly name: string
	readonly description: string
	readonly price?: number
	readonly currency?: 'USDC' | 'DEV' | 'ETH' | 'MATIC'
	readonly imageSrc: string
	readonly payload: Uint8Array | string
	readonly fee?: {
		readonly percentage: number
		readonly beneficiary: string
	}
	readonly deprecated?: boolean
	readonly paymentType?: 'instant' | 'stake' | 'custom'
	readonly accessControl?: {
		readonly url: string
		readonly description: string
	}
}
