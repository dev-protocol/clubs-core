/// <reference types="vitest" />
import { getViteConfig } from 'astro/config'
import vue from '@vitejs/plugin-vue'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { vitePreprocess } from '@astrojs/svelte'

export default getViteConfig({
	plugins: [vue(), svelte({ preprocess: [vitePreprocess()] })],
	test: {
		environment: 'jsdom',
	},
})
