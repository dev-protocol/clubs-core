<template>
	<button
			v-if="!link"
			v-bind:class="`hs-button${type && ' ' + assertType(type)}`"
			role="button"
			:disabled="isDisabled"
	>
		<i v-if="isIconVisible" class="hs-button__icon"
		><slot name="icon"></slot
		></i>
		<span v-if="isLabelVisible" class="hs-button__label"><slot></slot></span>
	</button>

	<a
			v-else
			v-bind:class="`hs-button${type && ' ' + assertType(type)}`"
			role="link"
			:[href]="link"
			:target="assertTarget(link)"
	>
		<i v-if="isIconVisible" class="hs-button__icon"
		><slot name="icon"></slot
		></i>
		<span v-if="isLabelVisible" class="hs-button__label"><slot></slot></span>
	</a>
</template>

<script>
import { Comment } from 'vue'
export default {
	name: 'HSButton',
	props: {
		link: {
			type: String,
			default: null,
		},
		isDisabled: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: '',
		},
	},
	computed: {
		isLabelVisible() {
			return (
				this.$slots.default &&
				this.$slots.default().findIndex((o) => o.type !== Comment) !== -1
			)
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
		assertType(type) {
			const finalTypes = []
			type.split(' ').forEach((type) => {
				finalTypes.push('is-' + type)
			})
			return finalTypes.join(' ')
		},
		assertTarget(link) {
			const _isExternalLink = (link) => !!(link.startsWith('http://') || link.startsWith('https://'));
			return _isExternalLink(link) ? '_blank' : '_self';
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
