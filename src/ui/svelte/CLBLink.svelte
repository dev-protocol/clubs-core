<script lang="ts">
	export let link: string
	const target: string | null = link && _assertTarget(link)

	function _assertTarget(link: string): string {
		const _isExternalLink = (link: string): boolean =>
			!!(link.startsWith('http://') || link.startsWith('https://'))
		return _isExternalLink(link) ? '_blank' : '_self'
	}
</script>

<a href={link} class="hs-link" {target}>
	<slot />
</a>
