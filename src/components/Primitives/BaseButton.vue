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
	},
	data: () => ({
		classByStatus: {
			0: 'base-button',
			1: 'base-button-loading',
			2: 'base-button-success',
		},
	}),
	components: { Spinner },
})
</script>

<style scoped>
.base-button {
	@apply bg-gray-900 hover:bg-gray-800 hover:ring-1 ring-gray-900;
}
.base-button-loading {
	@apply bg-gray-800 border-2 border-gray-900;
}
.base-button-success {
	@apply bg-green-600 border-2 border-green-700;
}
</style>
