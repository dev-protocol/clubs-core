<template>
	<button
		class="text-sm font-medium px-12 py-4 rounded transition"
		:class="classByStatus[status]"
	>
		<!-- Default Status -->
		<slot v-if="status === 0" />
		<!-- Loading Status -->
		<p v-else-if="status === 1">
			{{ loadingText }}
		</p>
		<!-- Success Status -->
		<p v-else-if="status === 2">{{ successText }} &nbsp; &checkmark;</p>
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'HSButton',
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
			0: 'hs-button',
			1: 'hs-button-loading',
			2: 'hs-button-success',
		},
	}),
})
</script>

<style scoped>
.hs-button {
	@apply bg-gray-900 hover:bg-gray-800 hover:ring-1 ring-gray-900;
}
.hs-button-loading {
	@apply bg-gray-800 ring-2 ring-gray-900;
}
.hs-button-success {
	@apply bg-green-600 ring-2 ring-green-700;
}
</style>
