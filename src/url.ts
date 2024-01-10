import type { Props } from 'astro'
import type { ClubsGetStaticPathsItem } from './types'
import type { UndefinedOr } from '@devprotocol/util-ts'
import { routerFactory } from './fixtures'

/**
 * Find a path where matches Astro.params.page
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
	routerFactory(items, (i) => i.params.page)(page)
