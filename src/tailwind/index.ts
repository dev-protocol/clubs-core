import { theme } from '@devprotocol/hashi/tailwind'

export const clubs = {
	content: [
		'./{src,node_modules/@devprotocol/clubs-core,node_modules/*clubs*plugin*}/**/*.{astro,js,jsx,svelte,ts,tsx,vue}',
	],
	theme: {
		extend: {
			screens: theme.screens,
			colors: theme.colors,
			fontFamily: theme.fontFamily,
		},
	},
}
