import hashi from '@devprotocol/hashi/tailwind'

export const clubs = {
	content: [
		'./{src,node_modules/@devprotocol/clubs-core,node_modules/*clubs*plugin*}/**/*.{astro,svelte,vue,html,js,jsx,ts,tsx}',
	],
	theme: {
		extend: {
			colors: hashi.theme.colors,
			fontFamily: hashi.theme.fontFamily,
		},
	},
}
