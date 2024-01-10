<script lang="ts">
	import CLBSkeleton from './CLBSkeleton.svelte'

	export let title: string|undefined
	export let subtitle: string|undefined
	export let media: string|undefined
</script>

<div class="clb-tier">
	{#if media}
		<img
			src={media}
			class="clb-tier__media"
			alt={`Media file of the ${title} badge.`}
		/>
	{/if}
	{#if !media}
		<div class="min-h-[16rem] w-full">
			<CLBSkeleton />
		</div>
	{/if}
	<div class="mb-2 grid">
		<div class="clb-tier__title">{title}</div>
		<div class="clb-tier__subtitle">{subtitle}</div>
	</div>
	{#if $$slots.default}
		<div class="clb-tier__actions">
			<slot />
		</div>
	{/if}
</div>
