<template>
	<button
		class="text-sm font-medium px-12 py-4 rounded-lg transition"
		:class="classByStatus[status]"
	>
		<!-- Default Status -->
		<slot v-if="status === 0" />
		<!-- Loading Status -->
		<div
			v-else-if="status === 1"
			class="flex justify-center items-center space-x-2 rounded-lg"
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
			0: 'action-button',
			1: 'action-button-loading',
			2: 'action-button-success',
			3: 'action-button-error',
		},
	}),
	components: { Spinner },
})
</script>

<style scoped>
.action-button {
	@apply bg-gray-900 hover:bg-gray-800 hover:ring-1 ring-gray-900;
}
.action-button-loading {
	@apply bg-gray-800 border-2 border-gray-900;
}
.action-button-success {
	@apply bg-green-600 border-2 border-green-700;
}
.action-button-error {
	@apply bg-red-600 border-2 border-red-700;
}
</style>
