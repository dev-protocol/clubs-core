/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statement */
import type {
	ClubsConfiguration,
	ClubsFunctionAdminFactory,
	ClubsFunctionConfigFetcher,
	ClubsFunctionPageFactory,
	ClubsFunctionPlugin,
	ClubsGetStaticPathsResult,
	ClubsPlugin,
	ClubsPluginsMap,
	ClubsStaticPaths,
	ClubsPropsAdminPages,
} from './types'
import { getClubsConfig } from './getClubsConfig'
import { Props } from 'astro'

type Plugins = readonly (ClubsPlugin & ClubsFunctionPlugin)[]

const _listPlugins = async (
	config: ClubsConfiguration,
	list: ClubsPluginsMap
): Promise<Plugins> => {
	const plugins: Plugins = await Promise.all(
		config.plugins
			.filter(({ name }) => Object.prototype.hasOwnProperty.call(list, name))
			.map(async ({ name, enable = true, options }) => {
				const fn = list[name]
				return { name, enable, options, ...fn }
			})
	)
	return plugins
}

const _configFactory: (
	configFetcher: ClubsFunctionConfigFetcher
) => () => Promise<ClubsConfiguration> =
	// eslint-disable-next-line functional/functional-parameters
	(configFetcher) => async (): Promise<ClubsConfiguration> => {
		const [config] = await getClubsConfig(configFetcher)
		return config
	}

const _staticPathsFromPlugins =
	(
		config: ClubsConfiguration,
		caller: 'getPagePaths' | 'getAdminPaths',
		additionalProps?: (i: number) => Props
	) =>
		async (plugins: Plugins): Promise<ClubsStaticPaths> =>
			(
				await Promise.all(
					plugins.map(async (plugin) => {
						const results = await plugin[caller](plugin.options, config)
						const updated = additionalProps
							? results.map((res, i) => ({
								...res,
								props: { ...res.props, ...additionalProps(i) },
							}))
							: results
						return updated
					})
				)
			).flat()

const _compose = (pluginResults: ClubsStaticPaths) =>
	pluginResults.map((res) => ({
		params: {
			page: res.paths.join('/') || undefined,
		},
		props: { ...res.props, component: res.component },
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
			const staticPaths = _compose(pluginResults)

			return staticPaths
		}

const _staticAdminPathsFactory: (
	configFetcher: ClubsFunctionConfigFetcher,
	pluginsMap: ClubsPluginsMap
) => () => Promise<ClubsGetStaticPathsResult> =
	(configFetcher, pluginsMap) =>
		// eslint-disable-next-line functional/functional-parameters
		async (): Promise<ClubsGetStaticPathsResult> => {
			const [config, encodedClubsConfiguration] = await getClubsConfig(
				configFetcher
			)
			const pluginMetas = Object.keys(pluginsMap).map((name) => ({
				name,
				meta: pluginsMap[name].meta,
			}))
			const plugins = await _listPlugins(config, pluginsMap)
			const getResultsOfPlugins = _staticPathsFromPlugins(
				config,
				'getAdminPaths',
				(currentPluginIndex) =>
				({
					clubs: {
						encodedClubsConfiguration,
						currentPluginIndex,
						plugins: pluginMetas,
					},
				} as ClubsPropsAdminPages)
			)
			const pluginResults = await getResultsOfPlugins(plugins)
			const staticPaths = _compose(pluginResults)

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
