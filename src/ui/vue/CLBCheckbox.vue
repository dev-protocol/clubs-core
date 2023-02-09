<template>
	<label class="hs-tick-field">
		<input
			class="hs-tick-field__input"
			type="checkbox"
			:id="value"
			:name="name"
			:value="value"
			@change="onChange"
			:checked="isChecked"
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

<script>
export default {
	name: 'CLBCheckbox',
	props: {
		name: String,
		value: String,
		label: String,
		helper: String,
		media: String,
		mediaAlt: String,
		isChecked: Boolean,
		onChange: Function,
	},
}
</script>
