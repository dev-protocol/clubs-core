/* eslint-disable functional/functional-parameters */
import { default as Example } from './Example.astro'
import { default as Admin } from './Admin.astro'
import { default as Modal } from './Modal.astro'
import {
	ClubsFunctionGetPagePaths,
	ClubsFunctionGetAdminPaths,
	ClubsFunctionGetSlots,
	ClubsSlotName,
	ClubsFunctionGetApiPaths,
} from '../src'

export const getPagePaths: ClubsFunctionGetPagePaths = async () => [
	{ paths: [], component: Example },
	{
		paths: ['example'],
		component: Example,
		props: {
			hello: 'World',
			complexData: new Uint8Array([1, 2, 3]),
			someMethod: (i: unknown) => i,
		},
	},
]

export const getAdminPaths: ClubsFunctionGetAdminPaths = async (options) => [
	{
		paths: ['example'],
		component: Admin,
		props: { options },
	},
]

export const getSlots: ClubsFunctionGetSlots = async (options) => [
	{
		slot: ClubsSlotName.AdminModalCcontent,
		component: Modal,
		props: { x: 1 },
		order: 0,
	},
	{
		slot: ClubsSlotName.AdminModalCcontent,
		component: Modal,
		props: { x: 123 },
	},
]

export const getApiPaths: ClubsFunctionGetApiPaths = async (options) => [
	{
		paths: [],
		method: 'GET',
		handler: ({ request }) => ({
			body: JSON.stringify({ options, body: request.body }),
		}),
	},
]

export const meta = {
	id: 'example',
	displayName: 'Example',
	category: 'uncategorized',
}

export default { getPagePaths, getAdminPaths, getSlots, getApiPaths, meta }
