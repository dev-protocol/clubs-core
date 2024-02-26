import { describe, it, expect } from 'vitest'
import { findPage } from './url'
import type { ClubsGetStaticPathsItem } from './types'
import { regexpToSymbol, routerFactory } from './fixtures'

describe('regexpToSymbol and routerFactory', () => {
	it('findPage proxies routerFactory', () => {
		const staticPaths = [
			{
				params: { page: 'a' },
				props: { as: 1, clubs: { slots: [] } },
			},
			{
				params: { page: regexpToSymbol(/.*/) },
				props: { as: 2, clubs: { slots: [] } },
			},
			{
				params: { page: 'a/b/c' },
				props: { as: 3, clubs: { slots: [] } },
			},
		] satisfies readonly ClubsGetStaticPathsItem[]
		const page = 'a/1234-5678-abcd/b/#$%^&*()-;='

		expect(findPage(page, staticPaths)?.props.as).toBe(2)
		expect(
			routerFactory(staticPaths, (i) => i.params.page)(page)?.props.as
		).toBe(2)
	})
})
