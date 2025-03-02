import hashi from '@devprotocol/hashi/tailwind'
import { hsExtendedColorTokens } from '@devprotocol/hashi/tailwind/extensions'
import containerQueries from '@tailwindcss/container-queries'

export const clubs = {
	content: [
		'./{src,node_modules/@devprotocol/clubs-core,node_modules/**/*clubs*plugin*}/**/*.{astro,svelte,vue,html,js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				...hashi.theme.colors,
				...hsExtendedColorTokens,
			},
			fontFamily: hashi.theme.fontFamily,
		},
	},
	plugins: [containerQueries],
}

export default clubs
