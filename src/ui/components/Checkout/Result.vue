<script lang="ts" setup>
import { onMounted, ref, type ComputedRef, computed } from 'vue'
import { type UndefinedOr } from '@devprotocol/util-ts'
import { markdownToHtml } from '../../../markdown'
import Modal from '../Modal.vue'
import ModalCheckout from './ModalCheckout.vue'

type Props = {
	eoa?: string
	id?: number | string
	rpcUrl: string
	stakeSuccessful: boolean
	name: string | undefined
	description: string | undefined
	imageSrc: string | undefined
	videoSrc: string | undefined
	base: string | undefined
}
const props = defineProps<Props>()

const htmlDescription: ComputedRef<UndefinedOr<string>> = computed(() => {
	return markdownToHtml(props.description)
})

// modal visibility
const modalVisible = ref(false)

// open modal
const modalOpen = () => {
	modalVisible.value = true
}

// close modal
const modalClose = () => {
	modalVisible.value = false
}

onMounted(async () => {
	// Modal Open
	modalOpen()
})
</script>

<template>
	<Modal
		:eoa="eoa"
		:modalClose="modalClose"
		:is-visible="modalVisible"
		:modal-content="ModalCheckout"
		:attrs="{
			name: props.name,
			description: htmlDescription,
			imageSrc,
			videoSrc,
			base,
		}"
	>
		<template #preview>
			<slot name="preview" />
		</template>
		<template #after:description>
			<slot name="before:preview" />
		</template>
	</Modal>
</template>
