import type {
	ClubsConfiguration,
	ClubsFunctionAdminFactory,
	ClubsFunctionFactoryResult,
	ClubsFunctionPageFactory,
	ClubsFunctionPlugin,
	ClubsPlugin,
	ClubsPluginsMap,
} from './types'
import { getClubsConfig } from './getClubsConfig'
import { always } from 'ramda'

type Plugins = readonly (ClubsPlugin & ClubsFunctionPlugin)[]

const _listPlugins = async (
	config: ClubsConfiguration,
	list: ClubsPluginsMap
): Promise<Plugins> => {
	const plugins: Plugins = await Promise.all(
		config.plugins.map(async ({ name, enable = true, options }) => {
			const fn = list[name]
			return { name, enable, options, ...fn }
		})
	)
	return plugins
}

const _factory: (
	config: ClubsConfiguration,
	pluginsMap: ClubsPluginsMap,
	caller: 'getPagePaths' | 'getAdminPaths'
) => Promise<ClubsFunctionFactoryResult> = async (
	config,
	pluginsMap,
	caller
) => {
	const _plugins = await _listPlugins(config, pluginsMap)

	const _staticPathsFromPlugins = (
		await Promise.all(
			_plugins.map(async (plugin) => plugin[caller](plugin.options, config))
		)
	).flat()

	const _staticPaths = _staticPathsFromPlugins.map((plugin) => ({
		params: {
			page: plugin.paths.join('/') || undefined,
		},
		props: { ...plugin.props, component: plugin.component },
	}))

	return {
		getStaticPaths: always(_staticPaths),
		getCurrentConfig: always(config),
	}
}

export const pageFactory: ClubsFunctionPageFactory = async (options) => {
	const config = await getClubsConfig(options.config)
	return _factory(config, options.plugins, 'getPagePaths')
}

export const adminFactory: ClubsFunctionAdminFactory = async (options) => {
	const config = await getClubsConfig(options.config)
	return _factory(config, options.plugins, 'getAdminPaths')
}
