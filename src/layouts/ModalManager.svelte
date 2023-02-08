<script lang="ts">
	import { onMount } from "svelte"
	import type { ClubsEventsControlModal, ClubsEventsDetailControlModal } from "../types"
	import { ClubsEvents } from "../types"

	let data: ClubsEventsDetailControlModal = {open: false}
	const confirmExit = `You have attempted to leave this page. Your changes will be lost. Are you sure you want to exit this page?`

	onMount(()=>{
		window.addEventListener('beforeunload', (ev) => {
			ev.preventDefault()
			if (data.blocks) {
				ev.returnValue = confirmExit
				return confirmExit
			}
		})

		document.body.addEventListener(ClubsEvents.ControlModal, async (ev) => {
			const { detail } = ev as ClubsEventsControlModal

			data = detail
		})

	})

	const close=()=>{
		data = {
			...data,
			open: false
		}
	}
</script>


<div
	class={`fixed bg-black/30 inset-0 z-[1000] backdrop-blur-sm justify-center items-center p-4 ${data.open ? 'flex' : 'hidden'}`}
	tabindex="-1"
	aria-hidden="true"
>
	<div class="max-w-md rounded-xl bg-dp-blue-grey-300 p-8 grid gap-8 shadow-xl w-full">
		{#if data.state === 'loading'}
			<div role="presentation" class="mx-auto w-16 h-16 rounded-full animate-spin border-native-blue-300 border-l border-t border-r"></div>
		{/if}
		{#if data.state === 'alert'}
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mx-auto w-16 h-16 text-plox-300">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
		</svg>
		{/if}


		<slot></slot>

		{#if data.closeButton?.label}
		<div class="flex justify-center">
			<button
				on:click|preventDefault={(_) => close()}
				class='hs-button is-outlined w-fit'
			>
				{data.closeButton.label}
			</button>
		</div>
		{/if}

	</div>
</div>
