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
