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

export const getPagePaths = (async () => [
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
]) satisfies ClubsFunctionGetPagePaths

export const getAdminPaths = (async (options) => [
	{
		paths: ['example'],
		component: Admin,
		props: { options },
	},
]) satisfies ClubsFunctionGetAdminPaths

export const getSlots = (async (options) => [
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
]) satisfies ClubsFunctionGetSlots

export const getApiPaths = (async (options) => [
	{
		paths: [],
		method: 'GET',
		handler: ({ request }) => ({
			body: JSON.stringify({ options, body: request.body }),
		}),
	},
]) satisfies ClubsFunctionGetApiPaths

export const meta = {
	id: 'example',
	displayName: 'Example',
	category: 'uncategorized',
}

export default { getPagePaths, getAdminPaths, getSlots, getApiPaths, meta }
