import type {
	ClubsConfiguration,
	ClubsPlugin,
	ClubsPluginOptions,
} from '../types'

export const updatePluginOptionsEventListener = async (
	detail: { readonly data: ClubsPluginOptions; readonly pluginIndex: number },
	currentConfig: ClubsConfiguration
): Promise<ClubsConfiguration> => {
	const { data, pluginIndex } = detail

	const updatedPlugins = [...currentConfig.plugins].map(
		(mplg: ClubsPlugin, i) =>
			i === pluginIndex ? { ...mplg, options: data } : mplg
	)
	const updatedConfig = { ...currentConfig, plugins: updatedPlugins }

	return updatedConfig
}
