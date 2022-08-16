/* eslint-disable functional/functional-parameters */
import { default as Example } from './Example.astro'

export const getPagePaths = async () => [
	{ paths: ['example'], component: Example },
]

export const getAdminPaths = async () => []

export default {
	getPagePaths,
	getAdminPaths,
}
