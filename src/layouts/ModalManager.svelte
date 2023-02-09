<script lang="ts">
	import { onMount } from 'svelte'
	import type {
		ClubsEventsControlModal,
		ClubsEventsDetailControlModal,
	} from '../types'
	import { ClubsEvents } from '../types'

	let data: ClubsEventsDetailControlModal = { open: false }

	const unloadHandler = (ev: BeforeUnloadEvent) => {
		ev.preventDefault()
		return (ev.returnValue = `You have attempted to leave this page. Your changes will be lost. Are you sure you want to exit this page?`)
	}

	const manageListener = (add: boolean) => {
		if (add) {
			window.addEventListener('beforeunload', unloadHandler)
		} else {
			window.removeEventListener('beforeunload', unloadHandler)
		}
	}

	onMount(() => {
		document.body.addEventListener(ClubsEvents.ControlModal, async (ev) => {
			const { detail } = ev as ClubsEventsControlModal

			data = detail

			manageListener(Boolean(data.blocks && data.open))
		})
	})

	const close = () => {
		manageListener(false)
		data = {
			...data,
			open: false,
		}
	}
</script>

<div
	class={`fixed inset-0 z-[1000] items-center justify-center bg-black/30 p-4 backdrop-blur-sm ${
		data.open ? 'flex' : 'hidden'
	}`}
	tabindex="-1"
	aria-hidden="true"
>
	<div
		class="bg-dp-blue-grey-300 grid w-full max-w-md gap-8 rounded-xl p-8 shadow-xl"
	>
		{#if data.state === 'loading'}
			<div
				role="presentation"
				class="border-native-blue-300 mx-auto h-16 w-16 animate-spin rounded-full border-l border-t border-r"
			/>
		{/if}
		{#if data.state === 'alert'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="text-plox-300 mx-auto h-16 w-16"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
				/>
			</svg>
		{/if}

		<slot />

		{#if data.closeButton?.label}
			<div class="flex justify-center">
				<button
					on:click|preventDefault={(_) => close()}
					class="hs-button is-outlined w-fit"
				>
					{data.closeButton.label}
				</button>
			</div>
		{/if}
	</div>
</div>
