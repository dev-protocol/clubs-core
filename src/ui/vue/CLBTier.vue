<template>
	<div class="clb-tier">
		<img
			v-if="media"
			:src="media"
			class="clb-tier__media"
			:alt="`Media file of the ${title} badge.`"
		/>
		<CLBSkeleton v-if="!media" class="min-h-[16rem] w-full" />
		<div class="mb-2 grid">
			<div class="clb-tier__title">{{ title }}</div>
			<div class="clb-tier__subtitle">{{ subtitle }}</div>
		</div>
		<div v-if="hasAction" class="clb-tier__actions">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Comment } from 'vue'
import CLBSkeleton from './CLBSkeleton.vue'

export default {
	name: 'CLBTier',
	components: { CLBSkeleton },
	props: {
		title: String,
		subtitle: String,
		media: String,
	},
	computed: {
		hasAction() {
			return (
				this.$slots.default &&
				this.$slots.default().findIndex((o) => o.type !== Comment) !== -1
			)
		},
	},
}
</script>
