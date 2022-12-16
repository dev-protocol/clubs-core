/* eslint-disable functional/functional-parameters */
import { default as Example } from './Example.astro'
import { default as Admin } from './Admin.astro'

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

export const getAdminPaths = async (options) => [
	{
		paths: ['example'],
		component: Admin,
		props: { options },
	},
]

export const meta = {
	displayName: 'Example',
	category: 'uncategorized',
}

export default { getPagePaths, getAdminPaths, meta }
