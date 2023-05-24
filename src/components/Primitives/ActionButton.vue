<template>
	<button
		class="hs-button is-large is-filled transition"
		:class="classByStatus[status]"
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
import Spinner from '../Icons/Spinner.vue'

export default defineComponent({
	name: 'BaseButton',
	props: {
		// Status: 0 = Default, 1 = Loading, 2 = Success
		status: {
			type: Number,
			default: 0,
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
	data: () => ({
		classByStatus: {
			0: 'is-action-button',
			1: 'is-loading',
			2: 'is-success',
			3: 'is-error',
		},
	}),
	components: { Spinner },
})
</script>

<style lang="scss" scoped>
@use 'node_modules/@devprotocol/hashi/hs-button';

// @include hs-button.extend('action-button') {
// 	@include hs-button.color((
// 		fill: 'accent-400',
// 		ink: 'accent-ink',
// 		border: 'accent-400'
// 	));
//
// 	&:active {
// 		@include hs-button.color((
// 			fill: 'accent-300',
// 			ink: 'accent-ink',
// 			border: 'accent-300'
// 		));
// 	}
// }

.action-button-loading {
	@apply border-2 border-gray-900 bg-gray-800;
}

@include hs-button.extend('success') {
	@include hs-button.color(
		(
			fill: 'dp-green.400',
			ink: 'dp-green.ink',
			border: 'dp-green.400',
		)
	);
}
</style>
