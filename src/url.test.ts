import test from 'ava'
import { findPage } from './url'
import type { ClubsGetStaticPathsItem } from './types'
import { regexpToSymbol } from './fixtures/regexp'

test('findPage returns a static path where exact matches with a plugin specified path', (t) => {
	const staticPaths = [
		{
			params: { page: 'a' },
			props: { as: 1, clubs: { slots: [] } },
		},
		{
			params: { page: 'a/b' },
			props: { as: 2, clubs: { slots: [] } },
		},
		{
			params: { page: 'a/b/c' },
			props: { as: 3, clubs: { slots: [] } },
		},
	] satisfies readonly ClubsGetStaticPathsItem[]
	const res = findPage('a/b', staticPaths)

	t.is(res?.props.as, 2)
})

test('findPage returns the first match one when there are duplicate static paths that exact match paths', (t) => {
	const staticPaths = [
		{
			params: { page: 'a' },
			props: { as: 1, clubs: { slots: [] } },
		},
		{
			params: { page: 'a/b' },
			props: { as: 2, clubs: { slots: [] } },
		},
		{
			params: { page: 'a/b/c' },
			props: { as: 3, clubs: { slots: [] } },
		},
		{
			params: { page: 'a/b' },
			props: { as: 4, clubs: { slots: [] } },
		},
	] satisfies readonly ClubsGetStaticPathsItem[]
	const res = findPage('a/b', staticPaths)

	t.is(res?.props.as, 2)
})

test('findPage returns a static path where matches with a plugin specified path included RegExp', (t) => {
	const staticPaths = [
		{
			params: { page: 'a' },
			props: { as: 1, clubs: { slots: [] } },
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
			props: { as: 2, clubs: { slots: [] } },
		},
		{
			params: { page: 'a/1/b/c/d' },
			props: { as: 3, clubs: { slots: [] } },
		},
	] satisfies readonly ClubsGetStaticPathsItem[]
	const res = findPage('a/1234-5678-abcd/b/#$%^&*()-;=', staticPaths)

	t.is(res?.props.as, 2)
})

test('findPage wraps the entire path containing RegExp in `^$` then handles it', (t) => {
	const staticPaths = [
		{
			params: { page: 'a' },
			props: { as: 1, clubs: { slots: [] } },
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
			props: { as: 2, clubs: { slots: [] } },
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
			props: { as: 3, clubs: { slots: [] } },
		},
	] satisfies readonly ClubsGetStaticPathsItem[]
	const page = 'a/1234-5678-abcd/b/#$%^&*()-;=/.'
	const res = findPage(page, staticPaths)

	// 2nd static path's expression matches with the page if the RegExp has no `^$`
	t.true(/a\/((?!\/).)+\/b\/((?!\/).)+/.test(page))
	// But the result is 3rd static path
	t.is(res?.props.as, 3)
})

test('findPage prioritiezes exact match path more than a RegExp path', (t) => {
	const page = 'a/1234-5678-abcd/b/#$%^&*()-;='
	const staticPaths = [
		{
			params: { page: 'a' },
			props: { as: 1, clubs: { slots: [] } },
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
			props: { as: 2, clubs: { slots: [] } },
		},
		{
			params: { page },
			props: { as: 3, clubs: { slots: [] } },
		},
	] satisfies readonly ClubsGetStaticPathsItem[]
	const res = findPage(page, staticPaths)

	// 2nd static path's expression exactly matches with the page
	t.true(/^a\/((?!\/).)+\/b\/((?!\/).)+$/.test(page))
	// But the result is 3rd static path
	t.is(res?.props.as, 3)
})

test('findPage returns undefined if there is no match path', (t) => {
	const staticPaths = [
		{
			params: { page: 'a/1/b/2P' },
			props: { as: 1, clubs: { slots: [] } },
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
			props: { as: 2, clubs: { slots: [] } },
		},
	] satisfies readonly ClubsGetStaticPathsItem[]
	const res = findPage('a/1/b/2P.', staticPaths)

	t.is(res, undefined)
})
