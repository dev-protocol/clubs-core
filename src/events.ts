/* eslint-disable functional/no-expression-statements */

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
	ClubsEventsDetailUpdatedPluginOptions,
	ClubsEventsDetailUpdatedConfiguration,
	ClubsEventsDetailControlModal,
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
	handler: (data: string, onFinish: typeof finish) => void,
	options?: AddEventListenerOptions
) =>
	document.body.addEventListener(
		ClubsEvents.SubmitConfiguration,
		(ev) => handler((ev as ClubsEventsSubmitConfiguration).detail.data, finish),
		options
	)

export const onUpdatedPluginOptions = (
	handler: (data: CustomEvent<ClubsEventsDetailUpdatedPluginOptions>) => void,
	options?: AddEventListenerOptions
) =>
	document.body.addEventListener(
		ClubsEvents.UpdatedPluginOptions,
		(ev) => handler(ev as CustomEvent<ClubsEventsDetailUpdatedPluginOptions>),
		options
	)

export const onUpdatedConfiguration = (
	handler: (data: CustomEvent<ClubsEventsDetailUpdatedConfiguration>) => void,
	options?: AddEventListenerOptions
) =>
	document.body.addEventListener(
		ClubsEvents.UpdatedConfiguration,
		(ev) => handler(ev as CustomEvent<ClubsEventsDetailUpdatedConfiguration>),
		options
	)

export const onFinishConfig = (
	handler: (data: CustomEvent<ClubsEventsDetailFinishConfiguration>) => void,
	options?: AddEventListenerOptions
) =>
	document.body.addEventListener(
		ClubsEvents.FinishConfiguration,
		(ev) => handler(ev as CustomEvent<ClubsEventsDetailFinishConfiguration>),
		options
	)

export const controlModal = (data: ClubsEventsDetailControlModal) => {
	return document.body.dispatchEvent(
		new CustomEvent<ClubsEventsDetailControlModal>(ClubsEvents.ControlModal, {
			detail: data,
			cancelable: true,
		})
	)
}

const handlerStore = new WeakSet<(data?: Event) => void>()
export const onMountClient = (
	_handler: (data?: Event) => void,
	options?: AddEventListenerOptions
) => {
	handlerStore.add(_handler)
	const handler = (data?: Event) => {
		if (((data?.target as Document) ?? document).readyState === 'complete') {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			handlerStore.has(_handler) && _handler(data)
			handlerStore.delete(_handler)
			document.removeEventListener('readystatechange', handler)
			return
		}
	}
	document.addEventListener('readystatechange', handler, options)

	handler()
}
