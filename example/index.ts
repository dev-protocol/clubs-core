/* eslint-disable functional/functional-parameters */
import type {
	ClubsFunctionGetPagePaths,
	ClubsFunctionGetAdminPaths,
	ClubsFunctionPlugin,
} from '../src/types'
import { default as Example } from './Example.astro'

export const getPagePaths: ClubsFunctionGetPagePaths = async () => [
	{ page: 'example', component: Example },
]

export const getAdminPaths: ClubsFunctionGetAdminPaths = async () => []

export default { getPagePaths, getAdminPaths } as ClubsFunctionPlugin
