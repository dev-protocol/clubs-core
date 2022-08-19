/* eslint-disable functional/functional-parameters */
import {
	ClubsFunctionGetAdminPaths,
	ClubsFunctionGetPagePaths,
	ClubsFunctionPlugin,
} from '../src/types'
import { default as Example } from './Example.astro'

export const getPagePaths: ClubsFunctionGetPagePaths = async () => [
	{ paths: [], component: Example },
	{ paths: ['example'], component: Example },
]

export const getAdminPaths: ClubsFunctionGetAdminPaths = async () => []

export default {
	getPagePaths,
	getAdminPaths,
} as ClubsFunctionPlugin
