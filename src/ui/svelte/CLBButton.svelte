<script lang="ts">
	import { handleTarget, handleVariants } from '../lib'

	export let link: string | null
	export let type: string | null
	export let isDisabled: boolean = false
	export let onClick: () => void
	export let nativeType: "button" | "submit" | "reset" | null | undefined

	function _assertType(type: string): string {
		return handleVariants(type)
	}

	const _linkTarget: string = link ? handleTarget(link) : ''
</script>

{#if !link}
	<button
		class={`hs-button${type ? ' ' + _assertType(type) : ''}`}
		disabled={isDisabled}
		type={nativeType}
		on:click={onClick}
	>
		{#if $$slots.icon}
			<i class="hs-button__icon">
				<slot name="icon" />
			</i>
		{/if}
		{#if $$slots}
			<span class="hs-button__label"><slot /></span>
		{/if}
	</button>
{:else}
	<a
		class={`hs-button${type ? ' ' + _assertType(type) : ''}`}
		href={link}
		target={_linkTarget}
	>
		{#if $$slots.icon}
			<i class="hs-button__icon">
				<slot name="icon" />
			</i>
		{/if}
		{#if $$slots}
			<span class="hs-button__label"><slot /></span>
		{/if}
	</a>
{/if}
