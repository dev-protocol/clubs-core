<script lang="ts">
	import type { ClubsPluginMeta, ClubsThemePluginMeta } from '../types'

	export let meta: ClubsPluginMeta | ClubsThemePluginMeta
	export let enable: boolean = true
	export let onClick: (id: string) => void
</script>

<div>
	<button on:click={() => onClick(meta.id)}>
		{#if 'theme' in meta}
			<img
				alt={meta.displayName}
				role="none"
				src={meta.theme.previewImage}
				class={`aspect-[4/3] h-56 rounded-lg border-[3px] object-cover ${
					enable ? 'border-[#5B8BF5]' : 'border-transparent opacity-50'
				}`}
			/>
		{/if}
	</button>
	<h3 class="mt-2 text-xl font-bold">{meta.displayName}</h3>
</div>
