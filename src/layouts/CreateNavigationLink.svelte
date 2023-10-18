<script lang="ts">
	import type { UndefinedOr } from '@devprotocol/util-ts'
	import {
		type ClubsConfiguration,
		type ClubsNavigationLink,
		ClubsEvents,
		decode,
	} from '..'
	import { setConfig, buildConfig } from '../events'
	import { onMount } from 'svelte'

	const key = 'navigationLinks'
	export let config: string
	export let label: string
	export let link: ClubsNavigationLink
	const decodedConfig = decode<ClubsConfiguration>(config)
	const existingLinks =
		(decodedConfig.options?.find((opt) => opt.key === key)
			?.value as UndefinedOr<ClubsNavigationLink[]>) ?? []
	let hasMenu = existingLinks.some((nav) => nav.path === link.path)
	let waiting = false

	const action = () => {
		waiting = true
		setConfig({
			...decodedConfig,
			options: [
				...(decodedConfig.options?.filter((o) => o.key !== key) ?? []),
				{
					key,
					value: [...existingLinks, link],
				},
			],
		})
		setTimeout(buildConfig, 50)
	}

	onMount(() => {
		document.body.addEventListener(
			ClubsEvents.FinishConfiguration,
			(ev: any) => {
				if (typeof ev.detail.success === 'boolean') {
					if (ev.detail.success) {
						waiting = false
						hasMenu = true
					} else {
						// TODO: Add an error handling
					}
				}
			}
		)
	})
</script>

{#if hasMenu === false}
	<div class="flex w-full justify-end">
		<button
			on:click|preventDefault={() => action()}
			class={`hs-button is-large is-filled is-fullwidth ${
				waiting ? 'animate-pulse bg-gray-500/60' : ''
			}`}
			disabled={waiting}>{label}</button
		>
	</div>
{/if}
