/* eslint-disable functional/no-expression-statement */
import type { AstroIntegration } from 'astro'
import { ClubsAstroIntegrationOptions } from './types'

export const astro = function (
	options?: ClubsAstroIntegrationOptions
): AstroIntegration {
	return {
		name: '@devprotocol/clubs-core',
		hooks: {
			'astro:config:setup': async ({ updateConfig }) => {
				updateConfig({
					vite: {
						ssr: {
							noExternal: [/^.*clubs-plugin.*$/],
						},
					},
				})
			},
		},
	}
}
