import type { Props } from 'astro'
import type { ClubsGetStaticPathsItem } from './types'
import { whenDefined, type UndefinedOr } from '@devprotocol/util-ts'
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
 * findPage("my/123", [...])
 * ```
 */
export const findPage = <P extends Props = Props>(
	page: string,
	items: readonly ClubsGetStaticPathsItem<P>[]
): UndefinedOr<ClubsGetStaticPathsItem<P>> =>
	items.find(({ params }) => params.page === page) ??
	items.find(({ params }) => {
		const paramsPage = params.page ?? ''
		const match = paramsPage.match(reg) ?? undefined
		const regStr = match?.reduce((p, c) => {
			const regexp = symbolToRegexp(c).toString().slice(1, -1)
			return p.replace(c, `${regexp}`)
		}, paramsPage)
		const tester = whenDefined(regStr, (exp) => new RegExp(`^${exp}$`))
		return tester?.test(page) ?? false
	})
