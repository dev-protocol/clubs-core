export function handleTarget(link: string): string {
	const isLinkExternal = !!(link?.startsWith('http://') || link?.startsWith('https://'))
	return isLinkExternal ? '_blank' : '_self'
}
