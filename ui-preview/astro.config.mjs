import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vue from '@astrojs/vue'
import svelte from '@astrojs/svelte'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
	server: {
		port: 3000,
	},
	integrations: [vue(), react(), svelte(), tailwind()],
})
