/* eslint-disable functional/functional-parameters */
import { default as Example } from './Example.astro'
import { default as Admin } from './Admin.astro'
import { default as Modal } from './Modal.astro'

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

export const getSlots = async (options) => ({
	'admin:modal:content': [
		{
			component: Modal,
			props: 1,
			order: 0,
		},
		{
			component: Modal,
			props: 123,
		},
	],
})

export const meta = {
	displayName: 'Example',
	category: 'uncategorized',
}

export default { getPagePaths, getAdminPaths, getSlots, meta }
