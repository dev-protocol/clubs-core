<template>
	<label
		:class="`hs-tick-field${type ? ' ' + assertType(type) : ''}${
			isDisabled ? ' is-disabled' : ''
		}`"
	>
		<input
			class="hs-tick-field__input"
			type="checkbox"
			:id="id || value"
			:name="name"
			:value="value"
			@change="onChange"
			:checked="isChecked"
			:disabled="isDisabled"
		/>
		<img
			v-if="media"
			class="hs-tick-field__sprite"
			:src="media"
			width="32"
			height="32"
			:alt="mediaAlt"
		/>
		<span style="display: flex; flex-flow: column nowrap; align-items: start">
			<span class="hs-tick-field__label">{{ label }}</span>
			<span class="hs-tick-field__helper">{{ helper }}</span>
		</span>
	</label>
</template>

<script lang="ts">
export default {
	name: 'CLBCheckbox',
	props: {
		name: String,
		id: String,
		value: String,
		type: String,
		label: String,
		helper: String,
		media: String,
		mediaAlt: String,
		isChecked: Boolean,
		isDisabled: Boolean,
		onChange: Function,
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
