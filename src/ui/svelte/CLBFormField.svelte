<label class={`hs-form-field${type ? ' ' + _assertType(type) : ''}`}>
	<span class="hs-form-field__label">{label}</span>
	{#if inputType && inputType !== 'textarea'}
		<input
			required={isRequired}
			class="hs-form-field__input"
			name={name}
			type={inputType}
			placeholder={placeholder}
			disabled={isDisabled}
			readonly={isReadonly}
		/>
	{:else}
		 <textarea
			 class="hs-form-field__input"
			 required={isRequired}
			 rows={rows}
			 name={name}
			 placeholder={placeholder}
			 disabled={isDisabled}
			 readonly={isReadonly}></textarea
		 >
	{/if}
	<span v-if="helper" class="hs-form-field__helper">{helper}</span>
</label>

<script lang="ts">
	import {handleVariants} from "../lib";

	export let label: string;
	export let name: string;
	export let type: string;
	export let inputType: string = 'text';
	export let placeholder: string = '';
	export let helper: string;
	export let rows: number = 5;
	export let isRequired: boolean;
	export let isDisabled: boolean;
	export let isReadonly: boolean;

	function _assertType(type: string): string {
		return handleVariants(type)
	}
</script>
