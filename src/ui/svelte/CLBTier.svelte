<div class="clb-tier">
	{#if media}
		<img
			src={media}
			class="clb-tier__media"
			alt={`Media file of the ${title} badge.`}
		/>
	{/if}
	{#if !media}
		<CLBSkeleton class="min-h-[16rem] w-full" />
	{/if}
	<div class="mb-2 grid">
		<div class="clb-tier__title">{ title }</div>
		<div class="clb-tier__subtitle">{ subtitle }</div>
	</div>
	{#if $$slots.default}
		<div class="clb-tier__actions">
			<slot></slot>
		</div>
	{/if}
</div>

<script lang="ts">
import CLBSkeleton from "./CLBSkeleton.svelte";

export let title: string;
export let subtitle: string;
export let media: string;
</script>
