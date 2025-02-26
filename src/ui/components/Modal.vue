<script setup lang="ts">
import { useTemplateRef, type Component as VueComponent, watch } from 'vue'

const props = defineProps<{
	eoa?: string
	modalClose?: () => void
	isVisible: boolean
	modalContent: VueComponent
	attrs: { [key: string]: any }
}>()

const dialog = useTemplateRef('dialog')

watch(props, () => {
	if (props.isVisible) {
		dialog.value?.showModal()
	} else {
		dialog.value?.close()
	}
})
</script>

<style>
.v-enter-active {
	transition: transform 600ms cubic-bezier(0.07, 1.28, 0.5, 1);
}

.v-leave-active {
	transition: transform 600ms linear;
}

.v-enter-from {
	transform: translate(0, 100%);
}

.v-leave-to {
	transform: translate(0, 0);
}

html:has(dialog[open]) {
	overflow: hidden;
}
</style>

<template>
	<dialog
		ref="dialog"
		class="flex items-center justify-center m-auto w-full h-full box-border overflow-y-auto backdrop:bg-black/60 bg-transparent"
		:class="{ hidden: !isVisible }"
	>
		<Transition>
			<component
				:eoa="eoa"
				:modalClose="modalClose"
				v-show="isVisible"
				:is="modalContent"
				v-bind="attrs"
			>
				<template #after:description>
					<slot name="after:description" />
				</template>
			</component>
		</Transition>
	</dialog>
</template>
