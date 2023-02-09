<template>
	<a :href="link" class="hs-link" :target="assertTarget(link)">
		<slot />
	</a>
</template>

<script lang="ts">
export default {
	name: 'CLBLink',
	props: {
		link: {
			type: String,
			required: true,
		},
	},
	methods: {
		assertTarget(link: string): string {
			const _isExternalLink = (link: string): boolean =>
				!!(link.startsWith('http://') || link.startsWith('https://'))
			return _isExternalLink(link) ? '_blank' : '_self'
		},
	},
}
</script>
