/* eslint-disable functional/no-expression-statement */
import type { AstroIntegration } from 'astro'
import tailwind from '@astrojs/tailwind'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import react from '@astrojs/react'
import prefetch from '@astrojs/prefetch'
import markdownIntegration from '@astropub/md'
import { ClubsAstroIntegrationOptions } from './types'

export const astro = function (
	options?: ClubsAstroIntegrationOptions
): readonly AstroIntegration[] {
	return [
		{
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
		},
		markdownIntegration(),
		tailwind(),
		svelte(),
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.includes('-'),
				},
			},
		}),
		react(),
		prefetch({
			throttle: 10,
		}),
	]
}
