/* eslint-disable functional/functional-parameters */
import { default as Layout } from './Layout.astro'
import { default as Admin } from './Admin.astro'
import { default as Modal } from './Modal.astro'
import {
	ClubsFunctionGetPagePaths,
	ClubsFunctionGetAdminPaths,
	ClubsFunctionGetSlots,
	ClubsFunctionGetLayout,
	ClubsSlotName,
} from '../src'

export const getPagePaths = (async () => [
	{ paths: ['theme'], component: Admin, props: { a: 1 } },
]) satisfies ClubsFunctionGetPagePaths

export const getAdminPaths = (async () => [
	{ paths: ['theme'], component: Admin, props: { a: 1 } },
]) satisfies ClubsFunctionGetAdminPaths

export const getLayout = (async () => ({
	layout: Layout,
	props: { a: 1 },
})) satisfies ClubsFunctionGetLayout

export const getSlots = (async (options, _, { paths }) => {
	return [
		{
			slot: ClubsSlotName.AdminModalCcontent,
			component: Modal,
			props: { x: 456 },
		},
	]
}) satisfies ClubsFunctionGetSlots

export const meta = {
	id: 'theme',
	displayName: 'Example',
	category: 'theme',
	theme: {
		previewImage: 'https://dummyimage.com/600x400/2fc495/000000',
	},
}

export default { getPagePaths, getAdminPaths, getLayout, getSlots, meta }
