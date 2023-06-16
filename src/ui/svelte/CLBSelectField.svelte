<label class={`hs-select-field${type ? ' ' + assertType(type) : ''}`}>
	<span class="hs-select-field__label">{ label }</span>
	<select
		name={name}
		class="hs-select-field__input"
		required={isRequired}
		disabled={isDisabled}
	>
		<slot />
	</select>
	<span class="hs-select-field__helper">{ helper }</span>
</label>

<script lang="ts">
	export let label: string;
	export let name: string;
	export let helper: string;
	export let type: string;
	export let isRequired: boolean;
	export let isDisabled: boolean;

	function assertType(type: string) {
		const finalTypes: string[] = []
		type.split(' ').forEach((type) => {
			finalTypes.push('is-' + type)
		})
		return finalTypes.join(' ')
	}
</script>
