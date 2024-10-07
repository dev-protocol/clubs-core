export function handleVariants(variants: string): string {
	const finalVariants: string[] = []
	// eslint-disable-next-line
	variants.split(' ').forEach((variant: string): void => {
		// eslint-disable-next-line
		finalVariants.push('is-' + variant)
	})
	return finalVariants.join(' ')
}
