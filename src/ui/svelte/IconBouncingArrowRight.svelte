<script lang="ts">
	import IconArrowRight from './IconArrowRight.svelte'

	export let className: string | undefined
	export { className as class }

	export let size: 'sm' | 'md' = 'md'
	export let fillClass: string | null | undefined = undefined
	export let strokeClass: string | null | undefined = undefined
	export let justifyLeft: boolean = false
</script>

<span
	class={`
			inline-block
			animate-[bounceXAxis_1s_infinite]
			rounded-full
			p-2
			${size === 'sm' ? 'size-8' : ''}
			 ${size === 'md' ? 'size-10' : ''}
			 ${justifyLeft ? 'absolute left-5' : ''}
			 ${fillClass ?? true ? 'shadow-lg ring-1' : ''}
			 ${fillClass === undefined ? 'bg-purple-500' : ''}
			 ${strokeClass === undefined ? 'ring-purple-300' : ''}
			 ${typeof fillClass === 'string' ? fillClass : ''}
			 ${typeof className === 'string' ? className : ''}
			 `}
>
	<IconArrowRight class="size-full aspect-square text-white" />
</span>

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
