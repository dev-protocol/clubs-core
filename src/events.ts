import type {
	ClubsConfiguration,
	ClubsEventsDetailUpdateConfiguration,
	ClubsEventsDetailUpdatePluginOptions,
	ClubsPluginOptions,
} from './types'
import { ClubsEvents } from './types'

export const setOptions = (data: ClubsPluginOptions, pluginIndex: number) => {
	return document.body.dispatchEvent(
		new CustomEvent<ClubsEventsDetailUpdatePluginOptions>(
			ClubsEvents.UpdatePluginOptions,
			{
				detail: { data, pluginIndex },
				cancelable: true,
			}
		)
	)
}

export const setConfig = (data: ClubsConfiguration) => {
	return document.body.dispatchEvent(
		new CustomEvent<ClubsEventsDetailUpdateConfiguration>(
			ClubsEvents.UpdateConfiguration,
			{
				detail: { data },
				cancelable: true,
			}
		)
	)
}
