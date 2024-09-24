<script setup lang="ts">
import { i18nFactory } from '../../../i18n'
import { Strings } from './i18n'
import Skeleton from '../Skeleton/Skeleton.vue'
import { ProseTextInherit } from '../../../constants'
import { computed } from 'vue'

const props = defineProps<{
	eoa?: string
	modalClose?: () => void
	name: string | undefined
	description: string | undefined
	image: HTMLImageElement | undefined
}>()

const i18nBase = i18nFactory(Strings)
let i18n = i18nBase(['en'])

const passportPageUrl = computed(() =>
	window.location.hostname.includes('.prerelease.clubs.place')
		? `https://prerelease.clubs.place/passport/${props.eoa ?? ''}`
		: window.location.hostname.includes('.clubs.place')
		? `https://clubs.place/passport/${props.eoa ?? ''}`
		: `http://localhost:${window.location.port}/passport/${props.eoa ?? ''}`
)
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
	<div>
		<div
			class="bg-color-navy relative mb-2 flex h-auto min-h-52 w-full flex-col items-center justify-center overflow-hidden rounded-md border border-black p-2 lg:mb-6 lg:h-96 lg:min-h-0 lg:p-8"
		>
			<div
				class="w-h-screen bg-focus-lines origin-zero animate-spin-slow mask absolute inset-2/4 -translate-x-1/2 -translate-y-1/2 bg-center bg-no-repeat"
			></div>
			<h3 class="mb-1 text-white">
				<span v-if="name" class="text-xl italic lg:text-3xl">{{ name }}</span>
			</h3>
			<!-- image -->
			<img
				:src="image?.src"
				:width="image?.width"
				:height="image?.height"
				class="z-10 max-h-60 min-h-full max-w-60 object-contain lg:max-h-none lg:max-w-xl"
			/>
		</div>
		<div class="flex flex-col gap-4 px-0 lg:px-52">
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
				class="flex w-full flex-col gap-4 lg:flex-row lg:justify-between lg:gap-0"
			>
				<a
					v-if="!!eoa"
					:href="passportPageUrl"
					class="hs-button is-filled rounded-lg border px-0 py-4 text-base lg:px-12 lg:py-6"
				>
					{{ i18n('Passport') }}
				</a>
				<a
					href="/"
					class="hs-button is-filled rounded-lg border px-12 py-4 text-base lg:py-6"
				>
					{{ i18n('Home') }}
				</a>
				<button
					@click="modalClose"
					class="hs-button is-filled rounded-lg border px-12 py-4 text-base lg:py-6"
				>
					{{ i18n('Close') }}
				</button>
			</div>
		</div>
	</div>
</template>
