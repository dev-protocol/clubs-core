<script lang="ts">
	export let id: string|undefined
	export let name: string|undefined
	export let value: string|undefined
	export let type: string|undefined
	export let label: string|undefined
	export let helper: string|undefined
	export let media: string|undefined
	export let mediaAlt: string|undefined
	export let isChecked: boolean = false
	export let isDisabled: boolean = false
	export let onChange: (...args: any) => void|undefined
	export let onChange: (...args: any) => void|undefined

	function _assertType(type: string): string {
		const finalTypes: string[] = []
		type.split(' ').forEach((type) => {
			finalTypes.push('is-' + type)
		})
		return finalTypes.join(' ')
	}
</script>

<label
	class={`hs-tick-field${type ? ' ' + _assertType(type) : ''}${
		isDisabled ? ' is-disabled' : ''
	}`}
>
	<input
		class="hs-tick-field__input"
		type="checkbox"
		{id}
		{name}
		{value}
		on:change={onChange}
		checked={isChecked}
		disabled={isDisabled}
	/>
	{#if media}
		<img
			class="hs-tick-field__sprite"
			src={media}
			width="32"
			height="32"
			alt={mediaAlt}
		/>
	{/if}
	<span style="display: flex; flex-flow: column nowrap; align-items: start">
		<span class="hs-tick-field__label">{label}</span>
		<span class="hs-tick-field__helper">{helper}</span>
	</span>
</label>
