<template>
	<label class="hs-tick-field">
		<input
			class="hs-tick-field__input"
			type="radio"
			:id="value"
			name="input"
			:value="value"
			@change="action"
			:checked="checked"
		/>
	  <img
			class="hs-tick-field__sprite"
			:src="media"
			width="32"
			height="32"
			:alt="mediaAlt"
	  />
		<div class="d-flex flow-col items-start">
			<span class="hs-tick-field__label">{{ label }}</span>
			<span class="hs-tick-field__helper">{{ helper }}</span>
		</div>
	</label>
</template>

<script>
export default {
	name: 'CLBRadio',
	props: ['action', 'value', 'label', 'helper', 'media', 'mediaAlt', 'checked'],
}
</script>

<style lang="scss" scoped>
@use 'node_modules/@devprotocol/hashi/hs-tick-field';
@include hs-tick-field.render();
</style>
