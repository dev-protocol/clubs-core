<script lang="ts">
	export let id: string
	export let name: string
	export let value: string
	export let isChecked: boolean
	export let isDisabled: boolean
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
