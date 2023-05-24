<template>
	<label :class="`hs-select-field${type ? ' ' + assertType(type) : ''}`">
		<span class="hs-select-field__label">{{ label }}</span>
		<select
			:name="name"
			:required="isRequired"
			class="hs-select-field__input"
			:disabled="isDisabled"
		>
			<slot />
		</select>
		<span class="hs-select-field__helper">{{ helper }}</span>
	</label>
</template>

<script lang="ts">
export default {
	name: 'CLBSelectField',
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
		helper: {
			type: String,
		},
		isRequired: {
			type: Boolean,
			default: false,
		},
		isDisabled: {
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
