<template>
  <input :id="id" type="radio" :name="name" :value="value" :checked="isChecked" :disabled="isDisabled">
  <label :for="id" :class="`hs-button is-outlined${isDisabled ? ' is-disabled' : ''}`">
  	<span class="hs-button__label"><slot /></span>
	</label>
</template>

<script lang="ts">
export default {
  name: 'CLBButtonGroupItem',
	props: {
		id: String,
		name: String,
		value: String,
		isChecked: Boolean,
		isDisabled: Boolean,
	}
}
</script>
