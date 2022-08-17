import type {
	ClubsConfiguration,
	ClubsFunctionAdminFactory,
	ClubsFunctionFactoryResult,
	ClubsFunctionPageFactory,
	ClubsFunctionPlugin,
	ClubsPlugin,
} from './types'
import { getInstalledPath } from 'get-installed-path'
import { getClubsConfig } from './getClubsConfig'
import { always } from 'ramda'

type Plugins = readonly (ClubsPlugin & ClubsFunctionPlugin)[]

const _listPlugins = async (config: ClubsConfiguration): Promise<Plugins> => {
	const plugins: Plugins = await Promise.all(
		config.plugins.map(async ({ name, path, enable = true, options }) => {
			const fn = (await (enable && path
				? import(path)
				: enable
				? import(await getInstalledPath(name))
				: (undefined as never))) as ClubsFunctionPlugin
			return { name, path, enable, options, ...fn }
		})
	)
	return plugins
}

const _factory: (
	config: ClubsConfiguration,
	caller: 'getPagePaths' | 'getAdminPaths'
) => Promise<ClubsFunctionFactoryResult> = async (config, caller) => {
	const _plugins = await _listPlugins(config)

	const _staticPathsFromPlugins = (
		await Promise.all(
			_plugins.map(async (plugin) => plugin[caller](plugin.options, config))
		)
	).flat()

	const _staticPaths = _staticPathsFromPlugins.map((plugin) => ({
		params: {
			page: plugin.paths.join('/') || undefined,
		},
		props: { component: plugin.component },
	}))

	return { getStaticPaths: always(_staticPaths) }
}

export const pageFactory: ClubsFunctionPageFactory = async (configFetcher) => {
	const config = await getClubsConfig(configFetcher)
	return _factory(config, 'getPagePaths')
}

export const adminFactory: ClubsFunctionAdminFactory = async (
	configFetcher
) => {
	const config = await getClubsConfig(configFetcher)
	return _factory(config, 'getAdminPaths')
}
