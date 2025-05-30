<script setup lang="ts">
import { i18nFactory } from '../../../i18n'
import { Strings } from './i18n'
import Skeleton from '../Skeleton/Skeleton.vue'
import { ProseTextInherit } from '../../../constants'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import type { UndefinedOr } from '@devprotocol/util-ts'
import Spinner from '../../../layouts/components/Spinner.vue'
// @ts-ignore
import VideoFetch from '../../vue/VideoFetch.vue'

const props = defineProps<{
	eoa?: string
	modalClose?: () => void
	name: string | undefined
	description: string | undefined
	imageSrc: string | undefined
	videoSrc: string | undefined
	base: string | undefined
}>()

const cronCalling = ref<UndefinedOr<Promise<UndefinedOr<Response>>>>()
const clicked = ref(false)
const cronFinished = ref(false)
const eoa = ref(props.eoa)

const imageRef = useTemplateRef(`imageRef`)

const i18nBase = i18nFactory(Strings)
let i18n = ref<ReturnType<typeof i18nBase>>(i18nBase(['en']))

const passportPageUrl = computed(() =>
	window.location.hostname.includes('prerelease.clubs.place')
		? `https://prerelease.clubs.place/passport/${eoa.value ?? ''}/edit`
		: window.location.hostname.includes('clubs.place')
		? `https://clubs.place/passport/${eoa.value ?? ''}/edit`
		: `http://localhost:${window.location.port}/passport/${
				eoa.value ?? ''
		  }/edit`
)

const onClickPassport = async () => {
	clicked.value = true
	await cronCalling.value
	window.location.href = passportPageUrl.value
}

onMounted(async () => {
	i18n.value = i18nBase(navigator.languages)
	if (cronCalling.value === undefined) {
		cronCalling.value = ((fb) =>
			fetch('/api/cron/assets')
				.then(({ ok }) => (ok === false ? fb() : undefined))
				.catch(fb))(() => fetch('https://clubs.place/api/cron/assets'))
	}
	cronCalling.value.finally(() => {
		cronFinished.value = true
	})
	try {
		if (props.imageSrc && imageRef.value) {
			const response = await fetch(props.imageSrc)
			const blob = await response.blob()
			const blobDataUrl = URL.createObjectURL(blob)
			imageRef.value.src = blobDataUrl
		}
	} catch (error) {
		console.error('Error loading image:', error)
	}
	if (eoa.value === undefined) {
		const C = await import('../../../connection/connection')
		C.connection().account.subscribe((acc) => {
			eoa.value = acc
		})
	}
})
</script>

<style>
.bg-color-navy {
	background-color: #0d1426;
}

.w-h-screen {
	height: 200vw;
	width: 200vw;
}
@media (min-width: 1024px) {
	.w-h-screen {
		height: 100vw;
		width: 100vw;
	}
}

/* background focus lines */
.origin-zero {
	transform-origin: 0 0;
}

.bg-focus-lines {
	background-image: repeating-conic-gradient(
			rgba(255, 255, 255, 0) 0,
			rgba(255, 255, 255, 0) 13deg,
			rgba(255, 255, 255, 0.1) 13deg,
			rgba(255, 255, 255, 0.1) 16deg
		),
		repeating-conic-gradient(
			rgba(255, 255, 255, 0) 0,
			rgba(255, 255, 255, 0) 20deg,
			rgba(255, 255, 255, 0.1) 20deg,
			rgba(255, 255, 255, 0.1) 23deg
		),
		repeating-conic-gradient(
			rgba(255, 255, 255, 0) 0,
			rgba(255, 255, 255, 0) 5deg,
			rgba(255, 255, 255, 0.1) 5deg,
			rgba(255, 255, 255, 0.1) 8deg
		),
		repeating-conic-gradient(
			rgba(255, 255, 255, 0) 0,
			rgba(255, 255, 255, 0) 2deg,
			rgba(255, 255, 255, 0.1) 2deg,
			rgba(255, 255, 255, 0.1) 3deg
		);
}

.animate-spin-slow {
	animation: spin-slow 300s linear infinite;
}

@keyframes spin-slow {
	from {
		transform: rotate(0deg) translate(-50%, -50%);
	}
	to {
		transform: rotate(360deg) translate(-50%, -50%);
	}
}

.mask {
	mask-image: radial-gradient(
		transparent 0%,
		transparent 20%,
		white 50%,
		white
	);
}
</style>

<template>
	<div
		class="relative w-full max-w-screen-lg rounded-xl bg-white p-4 text-black shadow"
	>
		<a
			:href="props.base ?? '/'"
			class="absolute -right-10 -top-10 flex h-8 w-8 items-center justify-center hover:bg-none"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="white"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		</a>

		<div
			class="bg-color-navy min-h-52 relative mb-6 flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-md border border-black p-2 @xl/clb_result_modal:h-96 @xl/clb_result_modal:min-h-0 @xl/clb_result_modal:p-8"
		>
			<div
				class="w-h-screen bg-focus-lines origin-zero animate-spin-slow mask absolute inset-2/4 bg-center bg-no-repeat"
				style="transform: translate(50%, 50%)"
			></div>
			<h3 class="mb-1 text-white">
				<span
					v-if="name"
					class="text-xl italic @xl/clb_result_modal:text-3xl"
					>{{ name }}</span
				>
			</h3>
			<!-- image -->
			<span class="contents">
				<!-- This uses CSS instead of Vue's slot fallback content because Astro always inserts an empty element into the slot. -->
				<span class="peer contents">
					<slot name="preview" />
				</span>
				<span class="peer-has-[:not(:empty)]:hidden contents">
					<img
						v-if="imageSrc"
						ref="imageRef"
						class="max-w-60 z-10 max-h-60 min-h-full rounded-md object-contain @xl/clb_result_modal:max-h-none @xl/clb_result_modal:max-w-xl"
					/>
					<!-- video -->
					<VideoFetch
						v-if="!imageSrc && videoSrc"
						class="max-w-60 aspect-[1/1] rounded-md"
						video-class="rounded-md [&>video]:rounded-md"
						:url="videoSrc"
					/>
				</span>
			</span>
			<span class="text-base italic text-white">
				{{ i18n('PurchaseGreeting') }}
			</span>
		</div>
		<div class="flex flex-col gap-6 px-0 @4xl/clb_result_modal:px-52">
			<!-- description -->
			<aside
				v-if="description"
				v-html="description"
				class="break-all text-base"
				:class="ProseTextInherit"
			></aside>
			<Skeleton
				v-if="description === undefined"
				class="mx-auto h-full w-full"
			/>

			<!-- slots -->
			<slot name="after:description" />

			<div
				class="flex w-full flex-col gap-4 @4xl/clb_result_modal:flex-row @4xl/clb_result_modal:justify-between @4xl/clb_result_modal:gap-0"
			>
				<a
					v-if="cronFinished"
					:href="passportPageUrl"
					class="hs-button is-filled rounded-lg border px-0 py-4 text-base @4xl/clb_result_modal:px-12 @4xl/clb_result_modal:py-6"
				>
					{{ i18n('Passport') }}
				</a>
				<button
					v-if="!cronFinished"
					@click="onClickPassport"
					:disabled="clicked"
					class="hs-button is-filled items-center justify-center gap-2 rounded-lg border px-0 py-4 text-base disabled:animate-pulse disabled:bg-blue-600 @4xl/clb_result_modal:px-12 @4xl/clb_result_modal:py-6"
				>
					{{ i18n('Passport') }}
					<Spinner v-if="clicked" />
				</button>
				<a
					:href="props.base ?? '/'"
					class="hs-button is-filled rounded-lg border px-12 py-4 text-base @4xl/clb_result_modal:py-6"
				>
					{{ i18n('ContinueShopping') }}
				</a>
				<button
					v-if="false /* HIDDEN FOR NOW */"
					@click="modalClose"
					class="hs-button is-filled rounded-lg border px-12 py-4 text-base @4xl/clb_result_modal:py-6"
				>
					{{ i18n('Close') }}
				</button>
			</div>
		</div>
	</div>
</template>
