<template>
	<button
		class="hs-button is-large is-filled transition"
		:class="classByStatus"
	>
		<!-- Default Status -->
		<slot v-if="status === 0" />
		<!-- Loading Status -->
		<div
			v-else-if="status === 1"
			class="flex items-center justify-center space-x-2 rounded-lg"
		>
			<span class="text-sm font-medium">{{ loadingText }}</span>
			<Spinner class="mt-0.5" />
		</div>
		<!-- Success Status -->
		<template v-else-if="status === 2">{{ successText }} &checkmark;</template>
		<!-- Error Status -->
		<template v-else-if="status === 3">{{ errorText }} &cross;</template>
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Spinner from './Spinner.vue'

export default defineComponent({
	name: 'BaseButton',
	props: {
		// Status: 0 = Default, 1 = Loading, 2 = Success
		status: {
			type: Number,
			default: 0,
			validator: (v: number) => [0, 1, 2, 3].includes(v),
		},
		loadingText: {
			type: String,
			default: 'Loading',
		},
		successText: {
			type: String,
			default: 'Success',
		},
		errorText: {
			type: String,
			default: 'Error',
		},
	},
	computed: {
		classByStatus(): string {
			switch (this.status) {
				case 0:
					return 'is-action-button'
				case 1:
					return 'is-loading'
				case 2:
					return 'is-success'
				case 3:
					return 'is-error'
				default:
					return 'is-error'
			}
		},
	},
	components: { Spinner },
})
</script>

<style lang="scss" scoped>
// @use 'node_modules/@devprotocol/hashi/hs-button';

// .action-button-loading {
// 	@apply border-2 border-gray-900 bg-gray-800;
// }

// @include hs-button.extend('success') {
// 	@include hs-button.color(
// 		(
// 			fill: 'dp-green.400',
// 			ink: 'dp-green.ink',
// 			border: 'dp-green.400',
// 		)
// 	);
// }
</style>
