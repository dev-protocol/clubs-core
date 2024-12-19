<script setup lang="ts">
import { useTemplateRef, Component as VueComponent, watch } from 'vue'

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
	<div>
		<dialog
			ref="dialog"
			class="fixed inset-0 flex items-center justify-center overflow-y-auto"
			:class="{ hidden: !isVisible }"
		>
			<div class="fixed inset-0 bg-black/60"></div>
			<Transition>
				<div class="relative m-auto w-full py-4">
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
				</div>
			</Transition>
		</dialog>
	</div>
</template>
