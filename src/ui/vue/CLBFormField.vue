<template>
	<label :class="`hs-form-field${type ? ' ' + assertType(type) : ''}`">
		<span class="hs-form-field__label">{{ label }}</span>
		<input
			v-if="inputType !== 'textarea'"
			:required="isRequired"
			class="hs-form-field__input"
			:name="name"
			:type="inputType"
			:placeholder="placeholder"
			:disabled="isDisabled"
			:readonly="isReadonly"
		/>
		<textarea
			v-else
			class="hs-form-field__input"
			:required="isRequired"
			:rows="rows"
			:name="name"
			:placeholder="placeholder"
			:disabled="isDisabled"
			:readonly="isReadonly"
		/>
		<span v-if="helper" class="hs-form-field__helper">{{ helper }}</span>
	</label>
</template>

<script lang="ts">
export default {
	name: 'CLBFormField',
	props: {
		label: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		type: {
			type: String,
		},
		inputType: {
			type: String,
			required: true,
		},
		helper: {
			type: String,
		},
		placeholder: {
			type: String,
		},
		rows: {
			type: Number,
			default: 5,
		},
		isRequired: {
			type: Boolean,
			default: false,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		isReadonly: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		assertType(type: string): string {
			const finalTypes: string[] = []
			type.split(' ').forEach((type) => {
				finalTypes.push('is-' + type)
			})
			return finalTypes.join(' ')
		},
	},
}
</script>
