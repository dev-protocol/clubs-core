<script lang="ts" setup>
import { onMounted, ref, type ComputedRef, computed } from 'vue'
import {
	type UndefinedOr,
	whenDefined,
	whenDefinedAll,
} from '@devprotocol/util-ts'
import { JsonRpcProvider } from 'ethers'
import Skeleton from '../Skeleton/Skeleton.vue'
import { clientsSTokens } from '@devprotocol/dev-kit'
import { ProseTextInherit } from '../../../constants/class-names'
import { Strings } from './i18n'
import { i18nFactory } from '../../../i18n'
import { markdownToHtml } from '../../../markdown'
import Modal from '../Modal.vue'
import ModalCheckout from './ModalCheckout.vue'

const i18nBase = i18nFactory(Strings)
let i18n = i18nBase(['en'])

type Props = {
	eoa?: string
	id?: number | string
	rpcUrl: string
	stakeSuccessful: boolean
	name: string | undefined
	description: string | undefined
	imageSrc: string | undefined
}
const props = defineProps<Props>()

const tokenURI = ref<
	UndefinedOr<{
		readonly name: string
		readonly description: string
		readonly image: string
		readonly attributes: readonly [
			{
				readonly trait_type: 'Destination'
				readonly value: string
			},
			{
				readonly trait_type: 'Locked Amount'
				readonly display_type: 'number'
				readonly value: number
			},
			{
				readonly trait_type: 'Payload'
				readonly value: string
			}
		]
	}>
>()
const image = ref<HTMLImageElement>()
const htmlDescription: ComputedRef<UndefinedOr<string>> = computed(() => {
	return (
		tokenURI.value?.description && markdownToHtml(tokenURI.value.description)
	)
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
	const provider = new JsonRpcProvider(props.rpcUrl)
	i18n = i18nBase(navigator.languages)

	const [c1, c2] = await clientsSTokens(provider)
	const sTokens = c1 ?? c2
	const metadata = await whenDefinedAll([sTokens, props.id], ([client, id]) =>
		client.tokenURI(Number(id))
	)
	tokenURI.value = metadata
	whenDefined(metadata?.image, (src) => {
		const img = new Image()
		img.onload = () => {
			image.value = img
		}
		img.src = src
	})
	console.log({ metadata })

	// Modal Open
	modalOpen()
})
</script>

<template>
	<section class="rounded-md bg-white p-8 text-black shadow">
		<div class="mx-auto grid gap-8 md:max-w-lg">
			<slot name="before:preview" />
			<div
				class="-mx-8 grid gap-8 bg-dp-white-300 p-6 md:mx-auto md:w-full md:rounded-md"
			>
				<div class="flex flex-col gap-6">
					<p class="font-mono font-bold">
						{{ i18n('Minted') }} <span class="text-black/50">#{{ id }}</span>
					</p>

					<!-- me -->
					<Modal
						:eoa="eoa"
						:modalClose="modalClose"
						:is-visible="modalVisible"
						:modal-content="ModalCheckout"
						:attrs="{
							name: tokenURI?.name,
							description: htmlDescription,
							image: image,
						}"
					>
						<template #after:description>
							<slot name="before:preview" />
						</template>
					</Modal>

					<div class="rounded-lg border border-black/20 bg-black/10 p-4">
						<img
							v-if="image"
							:src="image.src"
							:width="image.width"
							:height="image.height"
							class="h-auto w-full rounded object-cover object-center sm:h-full sm:w-full"
						/>
						<Skeleton
							v-if="image === undefined"
							class="mx-auto aspect-square h-full w-full"
						/>
					</div>
					<span>
						<h3 class="break-all text-sm text-black/50">
							<span v-if="tokenURI?.name">{{ tokenURI.name }}</span>
							<Skeleton
								v-if="tokenURI?.name === undefined"
								class="mx-auto h-full w-full"
							/>
						</h3>
					</span>
					<aside
						v-if="htmlDescription"
						v-html="htmlDescription"
						class="mt-6 break-all opacity-80"
						:class="ProseTextInherit"
					></aside>
					<Skeleton
						v-if="htmlDescription === undefined"
						class="mx-auto h-full w-full"
					/>
				</div>
			</div>
		</div>
	</section>
</template>
