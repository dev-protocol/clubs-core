import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vue from '@astrojs/vue'
import tailwind from '@astrojs/tailwind'
import svelte from '@astrojs/svelte'

export default defineConfig({
	server: {
		port: 3000,
	},
	output: 'server',
	integrations: [
		vue(),
		react(),
		svelte(),
		tailwind({ applyBaseStyles: false }),
	],
})
