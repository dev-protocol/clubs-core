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
} from './types'
import { getClubsConfig } from './getClubsConfig'
import { Props } from 'astro'

type Plugins = readonly ClubsPluginDetails[]
type ClubsStaticPathWithDetails<T = Props | undefined> = ClubsStaticPath<T> & {
	readonly details: ClubsPluginDetails
}

const _listPlugins = async (
	config: ClubsConfiguration,
	list: ClubsPluginsMap
): Promise<Plugins> => {
	const plugins: Plugins = await Promise.all(
		config.plugins.map(async ({ name, enable = true, options }, i: number) => {
			const fn = list[name] || {}
			return { name, enable, options, ...fn, pluginIndex: i }
		})
	)

	return plugins.filter(({ name }) =>
		Object.prototype.hasOwnProperty.call(list, name)
	)
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
	async (plugins: Plugins): Promise<readonly ClubsStaticPathWithDetails[]> =>
		(
			await Promise.all(
				plugins.map(async (plugin) => {
					const results = (await plugin[caller](plugin.options, config)).map(
						(x) => ({ ...x, details: plugin })
					)
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

const _pathsToPage = (paths: readonly (string | undefined)[]) =>
	paths.join('/') || undefined

const _compose = (pluginResults: readonly ClubsStaticPathWithDetails[]) =>
	pluginResults.map((res) => ({
		params: {
			page: _pathsToPage(res.paths),
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
				} as Omit<ClubsPropsAdminPages, 'plugins'>)
		)
		const pluginResults = (await getResultsOfPlugins(
			plugins
		)) as readonly ClubsStaticPathWithDetails<ClubsPropsAdminPages>[]
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
					...plg.props.clubs,
					plugins: pluginsWithPaths,
				},
			},
		}))
		const staticPaths = _compose(injected)

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
