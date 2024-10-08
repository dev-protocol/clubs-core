<script lang="ts">
	export let className: string | undefined
	export let type: 'outline' | 'micro' = 'outline'
	export { className as class }
</script>

{#if type === 'outline'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class={className ?? 'size-6'}
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
		/>
	</svg>
{/if}

{#if type === 'micro'}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 16 16"
		fill="currentColor"
		class={className ?? 'size-6'}
	>
		<path
			fill-rule="evenodd"
			d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
			clip-rule="evenodd"
		/>
	</svg>
{/if}
