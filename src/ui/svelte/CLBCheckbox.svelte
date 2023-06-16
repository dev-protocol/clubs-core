<label class={`hs-tick-field${type ? ' ' + _assertType(type) : ''}${isDisabled ? ' is-disabled' : ''}`}>
	<input
		class="hs-tick-field__input"
		type="checkbox"
		id={id}
		name={name}
		value={value}
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

<script lang="ts">
	export let id: string;
	export let name: string;
	export let value: string;
	export let type: string;
	export let label: string;
	export let helper: string;
	export let media: string;
	export let mediaAlt: string;
	export let isChecked: boolean;
	export let isDisabled: boolean;
	export let onChange: (...args: any) => void;

	function _assertType(type: string): string {
		const finalTypes: string[] = []
		type.split(' ').forEach((type) => {
			finalTypes.push('is-' + type)
		})
		return finalTypes.join(' ')
	};
</script>
