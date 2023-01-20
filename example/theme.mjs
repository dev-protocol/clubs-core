/* eslint-disable functional/functional-parameters */
import { default as Layout } from './Layout.astro'
import { default as Admin } from './Admin.astro'

export const getPagePaths = async () => []

export const getAdminPaths = async () => [
	{ paths: ['theme'], component: Admin },
]

export const getLayout = async () => ({ layout: Layout })

export const meta = {
	displayName: 'Example',
	category: 'theme',
	theme: {
		previewImage: 'https://dummyimage.com/600x400/2fc495/000000',
	},
}

export default { getPagePaths, getAdminPaths, getLayout, meta }
