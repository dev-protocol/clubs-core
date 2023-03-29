<template>
	<aside class="sticky top-8 grid gap-8">
		<ConnectButton
			id="clubs_connect_button"
			v-if="showConnectButton"
			class="w-full"
		/>
		<div class="relative">
			<ActionButton
				class="w-full"
				:status="status.save"
				successText="Saved"
				loadingText="Saving"
				@click="save"
				>Save</ActionButton
			>
			<div
				v-if="status.error"
				class="bg-danger-300 mx-auto -mt-4 max-w-[99%] rounded px-4 pt-6 pb-2 text-sm text-white shadow"
			>
				{{ status.error }}
			</div>
		</div>
		<slot></slot>
	</aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { buildConfig, onMountClient } from '../events'
import {
	ClubsConfiguration,
	ClubsEvents,
	ClubsEventsDetailFinishConfiguration,
} from '../types'
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
		showConnectButton: {
			type: Boolean,
			default: true,
		},
	},
	data: () => ({
		status: {
			save: 0,
			error: null as ReturnType<typeof Error> | null,
		},
		timeout: null as ReturnType<typeof setTimeout> | null,
	}),
	mounted() {
		onMountClient(() => {
			document.body.addEventListener(
				ClubsEvents.FinishConfiguration,
				(ev: any) => {
					this.resetTimeout()
					let timer = null

					if (typeof ev.detail.success === 'boolean') {
						if (ev.detail.success) {
							this.status.save = 2 // Success state
							this.status.error = null

							// Reset save button to default state after showing success for 3 seconds
							timer = setTimeout(() => (this.status.save = 0), 3000)
						} else {
							this.status.save = 3 // Error state
							this.status.error = ev.detail.error

							// Reset save button to default state after showing error for 3 seconds
							timer = setTimeout(() => (this.status.save = 0), 3000)
						}
					}

					if (timer) this.timeout = timer
				}
			)
		})
	},
	methods: {
		async save() {
			this.status.save = 1 // Loading state
			buildConfig()
		},
		resetTimeout() {
			if (this.timeout) {
				clearTimeout(this.timeout)
				this.timeout = null
			}
		},
	},
})
</script>
