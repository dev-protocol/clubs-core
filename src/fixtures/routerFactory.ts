import { UndefinedOr, whenDefined } from '@devprotocol/util-ts'
import { symbolToRegexp } from './regexp'

const reg = /(\[\[((?!\]\]).)*\]\])/gi
const EMPTY = ''

/**
 * Returns a function that searches an array for items that have the string as value of the given key and returns it.
 * @param search URL pathname to match
 * @returns Finder function
 *
 * @example
 * ```ts
 * const router = routerFactory([{path: 'my/123', as: 1}], (i) => i.path)
 * router("my/123") // {path: 'my/123', as: 1}
 * ```
 */
export const routerFactory =
	<T extends Record<string, unknown>>(
		list: readonly T[],
		key: (t: T) => UndefinedOr<string>
	) =>
	(search?: string): UndefinedOr<T> => {
		return (
			list.find((item) => (key(item) ?? EMPTY) === (search ?? EMPTY)) ??
			list.find((item) => {
				const value = `${key(item) ?? EMPTY}`
				const match = value.match(reg) ?? undefined
				const regStr = match?.reduce((p, c) => {
					const regexp = symbolToRegexp(c).toString().slice(1, -1)
					return p.replace(c, `${regexp}`)
				}, value)
				const tester = whenDefined(regStr, (exp) => new RegExp(`^${exp}$`))
				return whenDefined(search, (_search) => tester?.test(_search)) ?? false
			})
		)
	}
