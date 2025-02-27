import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vue from '@astrojs/vue'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	output: 'server',
	integrations: [vue(), react(), svelte()],
	vite: {
		plugins: [tailwindcss()],
	},
})
