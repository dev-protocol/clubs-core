<script setup lang="ts">
import IconArrowRight from './IconArrowRight.vue'

const props = defineProps<{
	class?: string
	size?: 'sm' | 'md'
	fillClass?: string | null
	strokeClass?: string | null
	justifyLeft?: boolean
}>()
</script>

<template>
	<span
		class="inline-block animate-[bounceXAxis_1s_infinite] rounded-full p-2"
		:class="{
			'size-8': props.size === 'sm',
			'size-10': props.size === 'md' || props.size === undefined,
			'absolute left-5': props.justifyLeft,
			'shadow-lg ring-1': props.fillClass ?? true,
			'bg-purple-500': props.fillClass === undefined,
			'ring-purple-300': props.strokeClass === undefined,
			...(typeof props.fillClass === 'string'
				? { [props.fillClass]: true }
				: undefined),
			...(typeof props.class === 'string'
				? { [props.class]: true }
				: undefined),
		}"
	>
		<IconArrowRight class="size-full aspect-square text-white" />
	</span>
</template>

<style>
@keyframes bounceXAxis {
	0%,
	100% {
		transform: translateX(-25%);
		animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
	}
	50% {
		transform: none;
		animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
	}
}
</style>
