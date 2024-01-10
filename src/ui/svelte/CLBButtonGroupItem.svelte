<script lang="ts">
	export let id: string|undefined
	export let name: string|undefined
	export let value: string|undefined
	export let isChecked: boolean = false
	export let isDisabled: boolean = false
</script>

<input
	{id}
	type="radio"
	{name}
	{value}
	checked={isChecked}
	disabled={isDisabled}
/>
<label
	for={id}
	class={`hs-button is-outlined${isDisabled ? ' is-disabled' : ''}`}
>
	<span class="hs-button__label"><slot /></span>
</label>
