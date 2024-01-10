<script lang="ts">
	export let label: string|undefined
	export let name: string|undefined
	export let helper: string|undefined
	export let type: string|undefined
	export let isRequired: boolean = false
	export let isDisabled: boolean = false

	function assertType(type: string) {
		const finalTypes: string[] = []
		type.split(' ').forEach((type) => {
			finalTypes.push('is-' + type)
		})
		return finalTypes.join(' ')
	}
</script>

<label class={`hs-select-field${type ? ' ' + assertType(type) : ''}`}>
	<span class="hs-select-field__label">{label}</span>
	<select
		{name}
		class="hs-select-field__input"
		required={isRequired}
		disabled={isDisabled}
	>
		<slot />
	</select>
	<span class="hs-select-field__helper">{helper}</span>
</label>
