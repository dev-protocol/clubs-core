/**
 * Converts RegExp to a special symbol string
 * @param reg RegExp
 * @returns symbol string
 *
 * @example
 * ```ts
 * regexpToSymbol(/.+/) // "[[.+]]"
 * ```
 */
export const regexpToSymbol = (reg: RegExp): string =>
	`[[${reg.toString().slice(1, -1)}]]`

/**
 * Converts special symbol string to RegExp
 * @param str special symbol string
 * @returns parced RegExp or string
 *
 * @example
 * ```ts
 * symbolToRegexp("a") // "a"
 * symbolToRegexp("[[.+]]") // new RegExp(".+")
 * ```
 */
export const symbolToRegexp = (str: string): string | RegExp => {
	const isRegExp = str.startsWith('[[') && str.endsWith(']]')
	return isRegExp ? new RegExp(str.slice(2, -2)) : str
}
