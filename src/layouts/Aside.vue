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
import { setConfig } from '../events'
import { ClubsConfiguration } from '../types'

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
			console.log('Save method called. Props to aside:', this.$props)
			const newConfig = {
				name: 'Test',
				description: 'Test description',
				plugins: [],
				propertyAddress: '0x00',
				twitterHandle: '@test',
				url: 'https://devprotocol.xyz',
			} as ClubsConfiguration
			setConfig(newConfig)
		},
	},
})
</script>
