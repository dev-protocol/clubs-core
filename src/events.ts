/* eslint-disable functional/no-return-void */
import type {
	ClubsConfiguration,
	ClubsEventsDetailSubmitConfiguration,
	ClubsEventsDetailUpdateConfiguration,
	ClubsEventsDetailUpdatePluginOptions,
	ClubsEventsSubmitConfiguration,
	ClubsPluginOptions,
	ClubsEventsDetailFinishConfiguration,
	ClubsEventsDetailBuildConfiguration,
	ClubsEventsFinishConfiguration,
	ClubsEventsDetailUpdatedPluginOptions,
	ClubsEventsDetailUpdatedConfiguration,
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

export const updatedOptions = (
	results: ClubsEventsDetailUpdatedPluginOptions
) => {
	return document.body.dispatchEvent(
		new CustomEvent<ClubsEventsDetailUpdatedPluginOptions>(
			ClubsEvents.UpdatedPluginOptions,
			{
				detail: results,
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

export const updatedConfig = (
	results: ClubsEventsDetailUpdatedConfiguration
) => {
	return document.body.dispatchEvent(
		new CustomEvent<ClubsEventsDetailUpdatedConfiguration>(
			ClubsEvents.UpdatedConfiguration,
			{
				detail: results,
				cancelable: true,
			}
		)
	)
}

// eslint-disable-next-line functional/functional-parameters
export const buildConfig = () => {
	return document.body.dispatchEvent(
		new CustomEvent<ClubsEventsDetailBuildConfiguration>(
			ClubsEvents.BuildConfiguration,
			{
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

const finish = (results: ClubsEventsDetailFinishConfiguration) => {
	return document.body.dispatchEvent(
		new CustomEvent<ClubsEventsDetailFinishConfiguration>(
			ClubsEvents.FinishConfiguration,
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

export const onUpdatedPluginOptions = (
	handler: (data: CustomEvent<ClubsEventsDetailUpdatedPluginOptions>) => void
) =>
	document.body.addEventListener(ClubsEvents.UpdatedPluginOptions, (ev) =>
		handler(ev as CustomEvent<ClubsEventsDetailUpdatedPluginOptions>)
	)

export const onUpdatedConfiguration = (
	handler: (data: CustomEvent<ClubsEventsDetailUpdatedConfiguration>) => void
) =>
	document.body.addEventListener(ClubsEvents.UpdatedConfiguration, (ev) =>
		handler(ev as CustomEvent<ClubsEventsDetailUpdatedConfiguration>)
	)

export const onFinishConfig = (
	handler: (data: CustomEvent<ClubsEventsDetailFinishConfiguration>) => void
) =>
	document.body.addEventListener(ClubsEvents.FinishConfiguration, (ev) =>
		handler(ev as CustomEvent<ClubsEventsDetailFinishConfiguration>)
	)

export const onMountClient = (handler: (data: Event) => void) =>
	document.addEventListener('DOMContentLoaded', handler)
