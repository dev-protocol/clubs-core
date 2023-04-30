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

<script>
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

<style lang="scss" scoped>
@use '@devprotocol/hashi' with ($modular-mode: true);

.clb-tier {
	display: grid;
	justify-items: start;
	gap: hashi.primitive-token-get('padding.sm');

	.clb-tier__media {
		width: 100%;
		height: auto;
		border-radius: hashi.token-get('radius-medium');
	}

	.clb-tier__title {
		font-family: hashi.token-get('title-family');
		font-size: hashi.token-get('subtitle-size');
		font-weight: hashi.primitive-token-get('weight.bold');
		line-height: hashi.primitive-token-get('line-height.condensed');
	}

	.clb-tier__subtitle {
		font-family: hashi.token-get('subtitle-family');
		font-size: hashi.token-get('body-size');
		font-weight: hashi.primitive-token-get('weight.normal');
		line-height: hashi.primitive-token-get('line-height.condensed');
		text-transform: uppercase;
	}

	.clb-tier__actions {
		//
	}
}
</style>
