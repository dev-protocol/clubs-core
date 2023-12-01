import test from 'ava'
import { routerFactory } from './routerFactory'
import { regexpToSymbol } from './regexp'

test('router returns a route where exact matches with a specified path', (t) => {
	const router = routerFactory(
		[
			{
				params: { page: 'a' },
				as: 1,
			},
			{
				params: { page: 'a/b' },
				as: 2,
			},
			{
				params: { page: 'a/b/c' },
				as: 3,
			},
		],
		(i) => i.params.page
	)
	t.is(router('a/b')?.as, 2)
})

test('router returns the first match one when there are duplicate routes', (t) => {
	const router = routerFactory(
		[
			{
				params: { page: 'a' },
				as: 1,
			},
			{
				params: { page: 'a/b' },
				as: 2,
			},
			{
				params: { page: 'a/b/c' },
				as: 3,
			},
			{
				params: { page: 'a/b' },
				as: 4,
			},
		],
		(i) => i.params.page
	)

	t.is(router('a/b')?.as, 2)
})

test('router returns a route where the key matches search containing RegExp', (t) => {
	const router = routerFactory(
		[
			{
				params: { page: 'a' },
				as: 1,
			},
			{
				params: {
					page: [
						'a',
						regexpToSymbol(/((?!\/).)+/),
						'b',
						regexpToSymbol(/((?!\/).)+/),
					].join('/'),
				},
				as: 2,
			},
			{
				params: { page: 'a/1/b/c/d' },
				as: 3,
			},
		],
		(i) => i.params.page
	)
	t.is(router('a/1234-5678-abcd/b/#$%^&*()-;=')?.as, 2)
})

test('router wraps the entire key containing RegExp in `^$` then handles it', (t) => {
	const router = routerFactory(
		[
			{
				params: {
					page: [
						'a',
						regexpToSymbol(/((?!\/).)+/),
						'b',
						regexpToSymbol(/((?!\/).)+/),
					].join('/'),
				},
				as: 1,
			},
			{
				params: {
					page: [
						'a',
						regexpToSymbol(/((?!\/).)+/),
						'b',
						regexpToSymbol(/((?!\/).)+/),
						'.',
					].join('/'),
				},
				as: 2,
			},
			{
				params: { page: 'a/1/b/c/d' },
				as: 3,
			},
		],
		(i) => i.params.page
	)
	const page = 'a/1234-5678-abcd/b/#$%^&*()-;=/.'

	// 1st route matches with the page if the RegExp has no `^$`
	t.true(/a\/((?!\/).)+\/b\/((?!\/).)+/.test(page))
	// But the result is 2nd route
	t.is(router(page)?.as, 2)
})

test('router prioritiezes exact match route more than a RegExp route', (t) => {
	const page = 'a/1234-5678-abcd/b/#$%^&*()-;='
	const router = routerFactory(
		[
			{
				params: {
					page: 'a',
				},
				as: 1,
			},
			{
				params: {
					page: regexpToSymbol(/.*/),
				},
				as: 2,
			},
			{
				params: { page },
				as: 3,
			},
		],
		(i) => i.params.page
	)

	// 2nd route exactly matches with the page
	t.true(/^.*$/.test(page))
	// But the result is 3rd route
	t.is(router(page)?.as, 3)
})

test('router returns undefined if there is no match route', (t) => {
	const router = routerFactory(
		[
			{
				params: { page: 'a/1/b/2P' },
				as: 1,
			},
			{
				params: {
					page: [
						'a',
						regexpToSymbol(/((?!\/).)+/),
						'b',
						regexpToSymbol(/((?!\/).)+P/),
					].join('/'),
				},
				as: 2,
			},
		],
		(i) => i.params.page
	)

	t.is(router('a/1/b/2P.'), undefined)
})
