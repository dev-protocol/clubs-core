import { defineConfig } from 'astro/config'
import lit from '@astrojs/lit'
import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'

export default defineConfig({ integrations: [lit(), react(), svelte(), vue()] })
