/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statement */
import type {
	ClubsConfiguration,
	ClubsFunctionAdminFactory,
	ClubsFunctionConfigFetcher,
	ClubsFunctionPageFactory,
	ClubsGetStaticPathsResult,
	ClubsPlugins,
	ClubsPropsAdminPages,
	ClubsPluginDetails,
	ClubsStaticPath,
	ClubsFunctionThemePlugin,
	ClubsFunctionPlugin,
	ClubsPlugin,
	ClubsFunctionGetPluginConfigById,
	ClubsPropsPages,
	ClubsFunctionGetSlotsResults,
	ClubsSlot,
	ClubsFunctionGetPagePaths,
	ClubsFunctionGetAdminPaths,
	ClubsFunctionApiFactory,
	ClubsGetStaticPathsAdminResult,
} from './types'
import { ClubsPluginCategory } from './types'
import { getClubsConfig } from './getClubsConfig'
import type { APIRoute, Props } from 'astro'
import { regexpToSymbol } from './fixtures/regexp'
import { routerFactory } from './fixtures'

type Plugins<P extends ClubsFunctionPlugin = ClubsFunctionPlugin> =
	readonly ClubsPluginDetails<P>[]
type ClubsStaticPathWithDetails = ClubsStaticPath & {
	readonly details: ClubsPluginDetails
}

const _listPlugins = async (
	config: ClubsConfiguration,
	list: ClubsPlugins
): Promise<Plugins> => {
	// Test this `reduce`: `[{a:1}, {a: 2}, {a:3}].reduce((ac, v, i)=>([...ac, {...v, i}]), [])`
	const plugins: Plugins = config.plugins.reduce(
		(ac, { id, enable = true, options = [] }, i: number) => {
			const fn: ClubsFunctionPlugin | undefined = list.find(
				({ meta: _pluginMeta }) => id === _pluginMeta.id
			)
			return fn ? [...ac, { id, enable, options, ...fn, pluginIndex: i }] : ac
		},
		[] as Plugins
	)

	return plugins
}

const _findCurrentTheme = (
	plugins: Plugins
): ClubsPluginDetails<ClubsFunctionThemePlugin> => {
	return plugins.find(
		(plugin) =>
			(plugin.enable === true || typeof plugin.enable === 'undefined') &&
			plugin.meta.category === ClubsPluginCategory.Theme &&
			Object.prototype.hasOwnProperty.call(plugin, 'getLayout') &&
			Object.prototype.hasOwnProperty.call(plugin.meta, 'theme')
	) as ClubsPluginDetails<ClubsFunctionThemePlugin>
}

const _configFactory: (
	configFetcher: ClubsFunctionConfigFetcher
) => () => Promise<ClubsConfiguration> =
	// eslint-disable-next-line functional/functional-parameters
	(configFetcher) => async (): Promise<ClubsConfiguration> => {
		const [config] = await getClubsConfig(configFetcher)
		return config
	}

const getPluginConfigByIdFactory =
	(
		config: ClubsConfiguration,
		plugins: Plugins
	): ClubsFunctionGetPluginConfigById =>
	(
		id: string
	): readonly [ClubsPlugin, number] | readonly [undefined, undefined] => {
		const plugin = plugins.find(({ meta }) => meta.id === id)
		const res:
			| readonly [ClubsPlugin, number]
			| readonly [undefined, undefined] = plugin
			? [
					{
						id: plugin.id,
						options: plugin.options,
						enable: plugin.enable,
					},
					plugin.pluginIndex,
			  ]
			: [undefined, undefined]
		return res
	}

const _staticPathsFromPlugins =
	(
		config: ClubsConfiguration,
		caller: 'getPagePaths' | 'getAdminPaths',
		additionalProps?: (i: number) => Props
	) =>
	async (plugins: Plugins): Promise<readonly ClubsStaticPathWithDetails[]> =>
		(
			await Promise.all(
				plugins.map(async (plugin) => {
					const plgFn:
						| ClubsFunctionGetPagePaths
						| ClubsFunctionGetAdminPaths
						| undefined =
						caller === 'getPagePaths'
							? plugin.getPagePaths
							: caller === 'getAdminPaths'
							? plugin.getAdminPaths
							: undefined
					const results = (
						plgFn
							? await plgFn(plugin.options, config, {
									getPluginConfigById: getPluginConfigByIdFactory(
										config,
										plugins
									),
							  })
							: []
					).map((x) => ({ ...x, details: plugin }))
					const updated = additionalProps
						? results.map((res, i) => ({
								...res,
								props: { ...res.props, ...additionalProps(plugin.pluginIndex) },
						  }))
						: results
					return updated
				})
			)
		).flat()

const _sort = (a: ClubsSlot, b: ClubsSlot) => {
	return (a.order ?? Infinity) - (b.order ?? Infinity)
}
const _slotsFromPlugins =
	(config: ClubsConfiguration, factory: 'page' | 'admin') =>
	async (
		plugins: Plugins,
		paths: readonly (undefined | string | RegExp)[],
		additionalProps?: Props
	): Promise<ClubsFunctionGetSlotsResults> => {
		const results = await Promise.all(
			plugins.map(async (plugin) => {
				const results = plugin.getSlots
					? await plugin.getSlots(plugin.options, config, {
							getPluginConfigById: getPluginConfigByIdFactory(config, plugins),
							paths,
							factory,
					  })
					: []
				return results
			})
		)

		const propsInjected = results.flat().map((slot) => ({
			...slot,
			props: { ...slot.props, ...additionalProps },
		}))

		const res = [...propsInjected].sort(_sort)
		return res
	}

const _pathsToPage = (paths: readonly (string | RegExp | undefined)[]) =>
	paths.map((p) => (p instanceof RegExp ? regexpToSymbol(p) : p)).join('/') ||
	undefined

const _compose = <
	P extends Props,
	A extends ClubsStaticPathWithDetails = ClubsStaticPathWithDetails
>(
	pluginResults: readonly A[]
) =>
	pluginResults.map((res) => ({
		params: {
			page: _pathsToPage(res.paths),
		},
		props: {
			...(res.props as P),
			component: res.component,
			layout: res.layout,
		},
	}))

const _staticPagePathsFactory: (
	configFetcher: ClubsFunctionConfigFetcher,
	pluginsMap: ClubsPlugins
) => () => Promise<ClubsGetStaticPathsResult> =
	(configFetcher, pluginsMap) =>
	// eslint-disable-next-line functional/functional-parameters
	async (): Promise<ClubsGetStaticPathsResult> => {
		const [config] = await getClubsConfig(configFetcher)
		const plugins = await _listPlugins(config, pluginsMap)
		const getResultsOfPlugins = _staticPathsFromPlugins(config, 'getPagePaths')
		const pluginResults = await getResultsOfPlugins(plugins)
		const theme = _findCurrentTheme(plugins)
		const defaultLayout = await theme.getLayout(theme.options, config, {
			getPluginConfigById: getPluginConfigByIdFactory(config, plugins),
		})
		const themeInjected = pluginResults.map((res) => ({
			...res,
			layout: res.layout ?? defaultLayout.layout,
			props: { ...res.props, ...defaultLayout.props },
		}))
		const getResultsOfGetSlots = _slotsFromPlugins(config, 'page')
		const slotsInjected = await Promise.all(
			themeInjected.map(async (res) => ({
				...res,
				props: {
					...res.props,
					clubs: {
						slots: await getResultsOfGetSlots(plugins, res.paths),
					},
				},
			}))
		)
		const staticPaths = _compose<ClubsPropsPages>(
			slotsInjected
		) as ClubsGetStaticPathsResult

		return staticPaths
	}

const _staticAdminPathsFactory: (
	configFetcher: ClubsFunctionConfigFetcher,
	pluginsMap: ClubsPlugins
) => () => Promise<ClubsGetStaticPathsAdminResult> =
	(configFetcher, pluginsMap) =>
	// eslint-disable-next-line functional/functional-parameters
	async (): Promise<ClubsGetStaticPathsAdminResult> => {
		const [config, encodedClubsConfiguration] = await getClubsConfig(
			configFetcher
		)
		const plugins = await _listPlugins(config, pluginsMap)
		const getResultsOfPlugins = _staticPathsFromPlugins(
			config,
			'getAdminPaths',
			(currentPluginIndex) =>
				({
					clubs: {
						encodedClubsConfiguration,
						currentPluginIndex,
					},
				} as Omit<ClubsPropsAdminPages, 'plugins' | 'slots'>)
		)
		const pluginResults = (await getResultsOfPlugins(
			plugins
		)) as readonly ClubsStaticPathWithDetails[]
		const pluginsWithPaths = pluginResults.map((result) => {
			const {
				details: { getPagePaths, getAdminPaths, ...plg },
			} = result
			const page = _pathsToPage(result.paths)
			return {
				...plg,
				paths: result.paths,
				pathname: page ? `/admin/${page}` : `/admin`,
				page,
			}
		})

		const injected = pluginResults.map((plg) => ({
			...plg,
			props: {
				...plg.props,
				clubs: {
					...(plg.props as ClubsPropsAdminPages).clubs,
					plugins: pluginsWithPaths,
				},
			},
		}))

		const getResultsOfGetSlots = _slotsFromPlugins(config, 'admin')
		const slotsInjected = await Promise.all(
			injected.map(async (res) => ({
				...res,
				props: {
					...res.props,
					clubs: {
						...res.props.clubs,
						slots: await getResultsOfGetSlots(plugins, res.paths, {
							clubs: res.props.clubs,
						}),
					},
				},
			}))
		)

		const staticPaths = _compose<ClubsPropsAdminPages>(slotsInjected)

		return staticPaths
	}

export const pageFactory: ClubsFunctionPageFactory = (options) => {
	const getStaticPaths = _staticPagePathsFactory(
		options.config,
		options.plugins
	)
	const getCurrentConfig = _configFactory(options.config)
	return { getStaticPaths, getCurrentConfig }
}

export const adminFactory: ClubsFunctionAdminFactory = (options) => {
	const getStaticPaths = _staticAdminPathsFactory(
		options.config,
		options.plugins
	)
	const getCurrentConfig = _configFactory(options.config)
	return { getStaticPaths, getCurrentConfig }
}

export const apiFactory: ClubsFunctionApiFactory = (options) => {
	const ALL: APIRoute = async (context) => {
		const [config] = await getClubsConfig(options.config)
		const plugins = await _listPlugins(config, options.plugins)
		const getPluginConfigById = getPluginConfigByIdFactory(config, plugins)
		const utils = { getPluginConfigById }
		const { path } = context.params
		const [firstPath] = path?.split('/') ?? []

		const plugin = plugins.find((plg) => firstPath === plg.meta.id)
		const apiRoutes =
			plugin && typeof plugin.getApiPaths === 'function'
				? (await plugin.getApiPaths(plugin.options, config, utils)).filter(
						({ method }) => method === context.request.method
				  )
				: []

		const router = routerFactory(apiRoutes, (i) =>
			_pathsToPage([plugin?.meta.id, ...i.paths])
		)
		const routerWithSlash = routerFactory(
			apiRoutes,
			(i) => `${_pathsToPage([plugin?.meta.id, ...i.paths])}/`
		)
		const apiRoute = router(path) ?? routerWithSlash(path)
		const response = apiRoute
			? apiRoute.handler(context)
			: new Response(null, { status: 404 })
		return response
	}
	return { ALL }
}
