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

export const getPagePaths: ClubsFunctionGetPagePaths = async () => []

export const getAdminPaths: ClubsFunctionGetAdminPaths = async () => [
	{ paths: ['theme'], component: Admin },
]

export const getLayout: ClubsFunctionGetLayout = async () => ({
	layout: Layout,
})

export const getSlots: ClubsFunctionGetSlots = async (
	options,
	_,
	{ paths }
) => {
	return [
		{
			slot: ClubsSlotName.AdminModalCcontent,
			component: Modal,
			props: { x: 456 },
		},
	]
}

export const meta = {
	displayName: 'Example',
	category: 'theme',
	theme: {
		previewImage: 'https://dummyimage.com/600x400/2fc495/000000',
	},
}

export default { getPagePaths, getAdminPaths, getLayout, getSlots, meta }
