<script lang="ts" setup>
const {
	name,
	id,
	value,
	type,
	label,
	helper,
	media,
	mediaAlt,
	isChecked,
	isDisabled,
	onChange,
} = defineProps<{
	name: string
	id: string
	value: string
	type: string
	label: string
	helper: string
	media: string
	mediaAlt: string
	isChecked: boolean
	isDisabled: boolean
	onChange: ((payload: Event) => void) | undefined
}>()
const assertType = (type: string): string => {
	const finalTypes: string[] = []
	type.split(' ').forEach((type) => {
		finalTypes.push('is-' + type)
	})
	return finalTypes.join(' ')
}
</script>

<template>
	<label
		:class="`hs-tick-field${type ? ' ' + assertType(type) : ''}${
			isDisabled ? ' is-disabled' : ''
		}`"
	>
		<input
			class="hs-tick-field__input"
			type="radio"
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
