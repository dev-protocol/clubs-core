<template>
	<button
		v-if="!link"
		v-bind:class="`hs-button${type && ' ' + assertType(type)} ${
			loading && 'w-full animate-pulse bg-gray-500/60'
		}`"
		role="button"
		:disabled="isDisabled || loading"
	>
		<i v-if="isIconVisible" class="hs-button__icon"
			><slot name="icon"></slot
		></i>
		<span v-if="isLabelVisible" class="hs-button__label"><slot></slot></span>
	</button>

	<a
		v-else
		v-bind:class="`hs-button${type && ' ' + assertType(type)} ${
			loading && 'w-full animate-pulse bg-gray-500/60'
		}`"
		role="link"
		:href="link"
		:target="assertTarget(link)"
	>
		<i v-if="isIconVisible" class="hs-button__icon"
			><slot name="icon"></slot
		></i>
		<span v-if="isLabelVisible" class="hs-button__label"><slot></slot></span>
	</a>
</template>

<script lang="ts">
import { Comment } from 'vue'
export default {
	name: 'CLBButton',
	props: {
		link: {
			type: String,
			default: null,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		loading: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: '',
		},
	},
	computed: {
		isLabelVisible(): boolean {
			return this.$slots.default &&
				this.$slots.default().findIndex((o) => o.type !== Comment) !== -1
				? true
				: false
		},
		isIconVisible() {
			return (
				this.$slots.icon &&
				this.$slots.icon().findIndex((o) => o.type !== Comment) !== -1
			)
		},
		href() {
			return this.isDisabled ? null : 'href'
		},
	},
	methods: {
		assertType(type: string) {
			const finalTypes: string[] = []
			type.split(' ').forEach((type) => {
				finalTypes.push('is-' + type)
			})
			return finalTypes.join(' ')
		},
		assertTarget(link: string) {
			const _isExternalLink = (link: string) =>
				!!(link.startsWith('http://') || link.startsWith('https://'))
			return _isExternalLink(link) ? '_blank' : '_self'
		},
	},
}
</script>

<style lang="scss" scoped>
// Alterations
.hs-button {
	--hs-button-width: auto;
	flex-flow: row nowrap;
}
</style>
