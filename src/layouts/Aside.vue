<template>
	<aside>
		<ConnectButton class="w-full" />
		<ActionButton
			class="mt-6 w-full"
			:status="status.save"
			successText="Saved"
			loadingText="Saving"
			@click="save"
			>Save</ActionButton
		>
	</aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { buildConfig, setConfig } from '../events'
import { ClubsConfiguration } from '../types'
import ActionButton from '../components/Primitives/ActionButton.vue'
import ConnectButton from '../components/ConnectButton.vue'

export default defineComponent({
	name: 'Aside',
	components: {
		ActionButton,
		ConnectButton,
	},
	props: {
		config: {
			type: Object as () => ClubsConfiguration,
			required: true,
		},
	},
	data: () => ({
		status: {
			save: 0,
		},
	}),
	methods: {
		async save() {
			this.status.save = 1 // Loading state

			// const newConfig = {
			// 	name: 'Test',
			// 	description: 'Test description',
			// 	plugins: [],
			// 	propertyAddress: '0x00',
			// 	twitterHandle: '@test',
			// 	url: 'https://devprotocol.xyz',
			// } as ClubsConfiguration

			// const newConfig = this.config

			try {
				// Artificial Delay for now
				// await new Promise((res, _) => setTimeout(res, 1500))

				buildConfig()
				this.status.save = 2 // Success state

				// Reset save button to default state after showing success for 3 seconds
				setTimeout(() => (this.status.save = 0), 3000)
			} catch (e) {
				console.error('Error while saving', e)
				this.status.save = 0 // Default state
			}
		},
	},
})
</script>
