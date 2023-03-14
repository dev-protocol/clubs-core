/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statement */
import type {
	ClubsConfiguration,
	ClubsFunctionAdminFactory,
	ClubsFunctionConfigFetcher,
	ClubsFunctionPageFactory,
	ClubsGetStaticPathsResult,
	ClubsPluginsMap,
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
} from './types'
import { ClubsPluginCategory } from './types'
import { getClubsConfig } from './getClubsConfig'
import { Props } from 'astro'

type Plugins<P extends ClubsFunctionPlugin = ClubsFunctionPlugin> =
	readonly ClubsPluginDetails<P>[]
type ClubsStaticPathWithDetails = ClubsStaticPath & {
	readonly details: ClubsPluginDetails
}

const _listPlugins = async (
	config: ClubsConfiguration,
	list: ClubsPluginsMap
): Promise<Plugins> => {
	const plugins: Plugins = await Promise.all(
		config.plugins.map(
			async ({ name, enable = true, options = [] }, i: number) => {
				const fn = list[name] || {}
				return { name, enable, options, ...fn, pluginIndex: i }
			}
		)
	)

	return plugins.filter(({ name }) =>
		Object.prototype.hasOwnProperty.call(list, name)
	)
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
						name: plugin.name,
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
								props: {
									...res.props,
									...additionalProps(plugin.pluginIndex),
									pluginMeta: plugin.meta,
								},
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
		paths: readonly (undefined | string)[],
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

const _pathsToPage = (paths: readonly (string | undefined)[]) =>
	paths.join('/') || undefined

const _compose = <P extends Props>(
	pluginResults: readonly ClubsStaticPathWithDetails[]
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
	pluginsMap: ClubsPluginsMap
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
		) as ClubsGetStaticPathsResult<ClubsPropsPages>

		return staticPaths
	}

const _staticAdminPathsFactory: (
	configFetcher: ClubsFunctionConfigFetcher,
	pluginsMap: ClubsPluginsMap
) => () => Promise<ClubsGetStaticPathsResult<ClubsPropsAdminPages>> =
	(configFetcher, pluginsMap) =>
	// eslint-disable-next-line functional/functional-parameters
	async (): Promise<ClubsGetStaticPathsResult<ClubsPropsAdminPages>> => {
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

		const staticPaths = _compose<ClubsPropsAdminPages>(
			slotsInjected
		) as ClubsGetStaticPathsResult<ClubsPropsAdminPages>

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
