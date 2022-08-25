import { defineConfig } from 'astro/config'
import { mergeDeepRight } from 'ramda'
import lit from '@astrojs/lit'
import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'

export const config = (overrides) =>
	defineConfig(
		mergeDeepRight({
			server: {
				port: 3000,
			},
			integrations: [lit(), react(), svelte(), vue()],
			overrides,
		})
	)
