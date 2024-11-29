<script setup lang="ts">
import { i18nFactory } from '../../../i18n'
import { Strings } from './i18n'
import Skeleton from '../Skeleton/Skeleton.vue'
import { ProseTextInherit } from '../../../constants'
import { computed, onMounted, ref } from 'vue'
import { UndefinedOr } from '@devprotocol/util-ts'
import Spinner from '../../../layouts/components/Spinner.vue'

const props = defineProps<{
	eoa?: string
	modalClose?: () => void
	name: string | undefined
	description: string | undefined
	image: HTMLImageElement | undefined
	imageSrc: string | undefined
	videoSrc: string | undefined
}>()

const cronCalling = ref<UndefinedOr<Promise<UndefinedOr<Response>>>>()
const clicked = ref(false)
const cronFinished = ref(false)

const i18nBase = i18nFactory(Strings)
let i18n = i18nBase(['en'])

const passportPageUrl = computed(() =>
	window.location.hostname.includes('.prerelease.clubs.place')
		? `https://prerelease.clubs.place/passport/${props.eoa ?? ''}`
		: window.location.hostname.includes('.clubs.place')
		? `https://clubs.place/passport/${props.eoa ?? ''}`
		: `http://localhost:${window.location.port}/passport/${props.eoa ?? ''}`
)

const onClickPassport = async () => {
	clicked.value = true
	await cronCalling.value
	window.location.href = passportPageUrl.value
}

onMounted(async () => {
	if (cronCalling.value === undefined) {
		cronCalling.value = ((fb) =>
			fetch('/api/cron/assets')
				.then(({ ok }) => (ok === false ? fb() : undefined))
				.catch(fb))(() => fetch('https://clubs.place/api/cron/assets'))
	}
	cronCalling.value.finally(() => {
		cronFinished.value = true
	})
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
	<div class="@container/clb_result_modal">
		<div
			class="bg-color-navy @xl/clb_result_modal:h-96 @xl/clb_result_modal:min-h-0 @xl/clb_result_modal:p-8 relative mb-6 flex h-auto min-h-52 w-full flex-col items-center justify-center overflow-hidden rounded-md border border-black p-2"
		>
			<div
				class="w-h-screen bg-focus-lines origin-zero animate-spin-slow mask absolute inset-2/4 -translate-x-1/2 -translate-y-1/2 bg-center bg-no-repeat"
			></div>
			<h3 class="mb-1 text-white">
				<span
					v-if="name"
					class="@xl/clb_result_modal:text-3xl text-xl italic"
					>{{ name }}</span
				>
			</h3>
			<!-- image -->
			<img
				:src="image?.src"
				:width="image?.width"
				:height="image?.height"
				class="@xl/clb_result_modal:max-h-none @xl/clb_result_modal:max-w-xl z-10 max-h-60 min-h-full max-w-60 object-contain"
			/>
			<img
				v-if="!image && imageSrc"
				:src="imageSrc"
				class="@xl/clb_result_modal:max-h-none @xl/clb_result_modal:max-w-xl z-10 max-h-60 min-h-full max-w-60 object-contain"
			/>
			<!-- video -->
			<video v-if="!image && !imageSrc && videoSrc" class="max-w-60 rounded" autoplay muted>
				<source :src="videoSrc" type="video/mp4" />
				Your browser does not support the video tag.
			</video>

		</div>
		<div class="@4xl/clb_result_modal:px-52 flex flex-col gap-6 px-0">
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
				class="@4xl/clb_result_modal:flex-row @4xl/clb_result_modal:justify-between @4xl/clb_result_modal:gap-0 flex w-full flex-col gap-4"
			>
				<a
					v-if="cronFinished"
					:href="passportPageUrl"
					class="hs-button is-filled @4xl/clb_result_modal:px-12 @4xl/clb_result_modal:py-6 rounded-lg border px-0 py-4 text-base"
				>
					{{ i18n('Passport') }}
				</a>
				<button
					v-if="!cronFinished"
					@click="onClickPassport"
					:disabled="clicked"
					class="hs-button is-filled @4xl/clb_result_modal:px-12 @4xl/clb_result_modal:py-6 items-center justify-center gap-2 rounded-lg border px-0 py-4 text-base disabled:animate-pulse disabled:bg-blue-600"
				>
					{{ i18n('Passport') }}
					<Spinner v-if="clicked" />
				</button>
				<a
					href="/"
					class="hs-button is-filled @4xl/clb_result_modal:py-6 rounded-lg border px-12 py-4 text-base"
				>
					{{ i18n('Home') }}
				</a>
				<button
					@click="modalClose"
					class="hs-button is-filled @4xl/clb_result_modal:py-6 rounded-lg border px-12 py-4 text-base"
				>
					{{ i18n('Close') }}
				</button>
			</div>
		</div>
	</div>
</template>
