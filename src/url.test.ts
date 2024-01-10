import test from 'ava'
import { findPage } from './url'
import type { ClubsGetStaticPathsItem } from './types'
import { regexpToSymbol, routerFactory } from './fixtures'

test('findPage proxies routerFactory', (t) => {
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

	t.is(findPage(page, staticPaths)?.props.as, 2)
	t.is(routerFactory(staticPaths, (i) => i.params.page)(page)?.props.as, 2)
})
