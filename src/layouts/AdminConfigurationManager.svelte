<script lang="ts">
	import { decode, encode } from '../index'
	import { submitConfig, updatedConfig, updatedOptions } from '../events'
	import type {
		ClubsEventsUpdatePluginOptions,
		ClubsEventsUpdateConfiguration,
	} from '../types'
	import { ClubsEvents } from '../types'
	import { updatePluginOptionsEventListener } from '../fixtures/utils'
	import { onMount } from 'svelte'

	export let encodedClubsConfiguration: string

	let currentConfig = decode(encodedClubsConfiguration)

	onMount(() => {
		document.body.addEventListener(
			ClubsEvents.UpdatePluginOptions,
			async (ev) => {
				let error: Error | undefined = undefined
				let pluginIndex: number | undefined = undefined
				try {
					ev.preventDefault()
					const {
						detail: { data, pluginIndex: _pluginIndex },
					} = ev as ClubsEventsUpdatePluginOptions
					pluginIndex = _pluginIndex

					console.log('Received event', ClubsEvents.UpdatePluginOptions, {
						data,
						pluginIndex,
					})

					const updatedConfig = await updatePluginOptionsEventListener(
						{ data, pluginIndex },
						currentConfig
					)

					currentConfig = updatedConfig

					console.log(
						'Updated ClubsConfiguration',
						ClubsEvents.UpdatePluginOptions,
						currentConfig
					)
				} catch (err) {
					error = err as unknown as Error
				} finally {
					updatedOptions({ success: error ? false : true, error, pluginIndex })
				}
			}
		)

		document.body.addEventListener(ClubsEvents.UpdateConfiguration, (ev) => {
			let error: Error | undefined = undefined
			try {
				ev.preventDefault()
				const {
					detail: { data },
				} = ev as ClubsEventsUpdateConfiguration

				console.log('Received event', ClubsEvents.UpdateConfiguration, {
					data,
				})

				currentConfig = data

				console.log(
					'Updated ClubsConfiguration',
					ClubsEvents.UpdateConfiguration,
					currentConfig
				)
			} catch (err) {
				error = err as unknown as Error
			} finally {
				updatedConfig({ success: error ? false : true, error })
			}
		})

		document.body.addEventListener(ClubsEvents.BuildConfiguration, (ev) => {
			ev.preventDefault()

			console.log('Received event', ClubsEvents.BuildConfiguration)

			const encodedConfig = encode(currentConfig)

			console.log('New configuration', encodedConfig)

			submitConfig(encodedConfig)
		})
	})
</script>
