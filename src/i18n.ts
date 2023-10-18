import type { UndefinedOr } from '@devprotocol/util-ts'

export type ClubsI18nContent =
	| ((vars: readonly UndefinedOr<string>[]) => string)
	| string

export type ClubsI18nLocale = Record<string, ClubsI18nContent>

export type ClubsI18nParts = Record<string, ClubsI18nLocale>

export type ClubsI18nFunction<P extends ClubsI18nParts> = (
	key: keyof P,
	vars?: readonly UndefinedOr<string>[]
) => string

const has = <T extends ClubsI18nLocale>(
	base: T,
	lang: string | number | symbol
): lang is keyof T => Object.hasOwn(base, lang)

export const i18nFactory =
	<P extends ClubsI18nParts>(parts: P) =>
	(langs: Navigator['languages']): ClubsI18nFunction<P> =>
	(key, vars) => {
		const base = parts[key]
		type Key = keyof typeof base
		const cand = langs.find((lang) =>
			has<typeof base>(base, lang)
		) as UndefinedOr<Key>
		const content = cand ? base[cand] : base[Object.keys(base)[0] as Key]
		return typeof content === 'function' ? content(vars ?? []) : content
	}
