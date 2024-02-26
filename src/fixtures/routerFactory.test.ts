import { describe, it, expect } from 'vitest'
import { routerFactory } from './routerFactory'
import { regexpToSymbol } from './regexp'

describe('routerFactory', () => {
	it('router returns a route where exact matches with a specified path', () => {
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
		expect(router('a/b')?.as).toBe(2)
	})

	it('router returns the first match one when there are duplicate routes', () => {
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

		expect(router('a/b')?.as).toBe(2)
	})

	it('router returns a route where the key matches search containing RegExp', () => {
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
		expect(router('a/1234-5678-abcd/b/#$%^&*()-;=')?.as).toBe(2)
	})

	it('router wraps the entire key containing RegExp in `^$` then handles it', () => {
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
		expect(/a\/((?!\/).)+\/b\/((?!\/).)+/.test(page)).toBe(true)
		// But the result is 2nd route
		expect(router(page)?.as).toBe(2)
	})

	it('router prioritiezes exact match route more than a RegExp route', () => {
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
		expect(/^.*$/.test(page)).toBe(true)
		// But the result is 3rd route
		expect(router(page)?.as).toBe(3)
	})

	it('router returns undefined if there is no match route', () => {
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

		expect(router('a/1/b/2P.')).toBe(undefined)
	})
})
