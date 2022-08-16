import type {
	ClubsFunctionPageFactory,
	ClubsFunctionPlugin,
	ClubsPlugin,
} from './types'
import { getInstalledPath } from 'get-installed-path'
import { getClubsConfig } from './getClubsConfig'

type Plugins = readonly (ClubsPlugin & ClubsFunctionPlugin)[]

export const pageFactory: ClubsFunctionPageFactory = async (configFetcher) => {
	const config = await getClubsConfig(configFetcher)
	const plugins: Plugins = await Promise.all(
		config.plugins.map(async ({ name, path, enable = true, options }) => {
			const fn =
				enable && path
					? ((await import(path)) as ClubsFunctionPlugin)
					: enable
					? ((await import(
							await getInstalledPath(name)
					  )) as ClubsFunctionPlugin)
					: (undefined as never)
			return { name, path, enable, options, ...fn }
		})
	)

	const pluginPaths = (
		await Promise.all(
			plugins.map(async (plugin) => plugin.getPagePaths(plugin.options, config))
		)
	).flat()

	const getStaticPaths = pluginPaths.map((plugin) => ({
		params: { page: plugin.page, nest: plugin.nest },
		props: { component: plugin.component },
	}))

	const isStaticBuild = Astro.props.component !== undefined
	const plugin = isStaticBuild
		? undefined
		: pluginPaths.find(
				({ page, nest }) =>
					page === Astro.params.page && nest === Astro.params.nest
		  )
	const Content = Astro.props.component ?? plugin?.component
	const r404 =
		!isStaticBuild && !plugin
			? new Response(null, {
					status: 404,
					statusText: 'Not found',
			  })
			: undefined

	return { getStaticPaths, r404, Content }
}
