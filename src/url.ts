import type { Props } from 'astro'
import type { ClubsGetStaticPathsItem } from './types'
import type { UndefinedOr } from '@devprotocol/util-ts'
import { symbolToRegexp } from './fixtures/regexp'

const reg = /(\[\[((?!\]\]).)*\]\])/gi

/**
 * Converts RegExp to a special symbol string
 * @param page Astro.params.page of [...page]
 * @param items The result array of getStaticPaths
 * @returns the found path or undefined
 *
 * @example
 * ```ts
 * findPageBy("my/123", [...])
 * ```
 */
export const findPageBy = <P extends Props = Props>(
	page: string,
	items: ClubsGetStaticPathsItem<P>[]
): UndefinedOr<ClubsGetStaticPathsItem<P>> =>
	items.find(({ params }) => params.page === page) ??
	items.find(({ params }) => {
		const page = params.page ?? ''
		const match = page.match(reg) ?? []
		const regStr = match.reduce((p, c, i) => {
			const regexp = symbolToRegexp(c).toString().slice(1, -1)
			return p.replace(c, `${regexp}`)
		}, page)
		const tester = new RegExp(regStr)
		return tester.test(page)
	})
