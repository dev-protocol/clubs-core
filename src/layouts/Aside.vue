<template>
	<aside>
		<BaseButton class="w-11/12">Connect Wallet</BaseButton>
		<BaseButton
			class="mt-6 w-11/12"
			:status="0"
			successText="Saved"
			loadingText="Saving"
			@click="save"
			>Save</BaseButton
		>
	</aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseButton from '../components/Primitives/BaseButton.vue'

export default defineComponent({
	name: 'Aside',
	components: {
		BaseButton,
	},
	props: ['clubs'],
	data: () => ({
		status: {
			save: 0,
		},
	}),
	methods: {
		save() {
			console.log('Save method called. Props to aside included', this.$props)
		},
	},
})
</script>
