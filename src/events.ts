/* eslint-disable functional/no-return-void */
import type {
	ClubsConfiguration,
	ClubsEventsDetailSubmitConfiguration,
	ClubsEventsDetailUpdateConfiguration,
	ClubsEventsDetailUpdatePluginOptions,
	ClubsEventsSubmitConfiguration,
	ClubsEventsFinishConfiguration,
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

export const submitConfig = (data: string) => {
	return document.body.dispatchEvent(
		new CustomEvent<ClubsEventsDetailSubmitConfiguration>(
			ClubsEvents.SubmitConfiguration,
			{
				detail: { data },
				cancelable: true,
			}
		)
	)
}

const finish = (results: ClubsEventsFinishConfiguration) => {
	return document.body.dispatchEvent(
		new CustomEvent<ClubsEventsFinishConfiguration>(
			ClubsEvents.SubmitConfiguration,
			{
				detail: results,
				cancelable: true,
			}
		)
	)
}

export const onSubmitConfig = (
	handler: (data: string, onFinish: typeof finish) => void
) =>
	document.body.addEventListener(ClubsEvents.SubmitConfiguration, (ev) =>
		handler((ev as ClubsEventsSubmitConfiguration).detail.data, finish)
	)
