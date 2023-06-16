export function handleVariants(variants: string): string {
	const comp: string[] = []
	variants.split(' ').forEach((variant) => {
		comp.push('is-' + variant)
	})
	return comp.join(' ')
}
