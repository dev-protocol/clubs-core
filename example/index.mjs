/* eslint-disable functional/functional-parameters */
import { default as Example } from './Example.astro'

export const getPagePaths = async () => [
	{ paths: [], component: Example },
	{
		paths: ['example'],
		component: Example,
		props: {
			hello: 'World',
			complexData: new Uint8Array([1, 2, 3]),
			someMethod: (i) => i,
		},
	},
]

export const getAdminPaths = async () => []

export default {
	getPagePaths,
	getAdminPaths,
}
