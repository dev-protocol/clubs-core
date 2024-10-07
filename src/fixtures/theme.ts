/* eslint-disable functional/no-expression-statements */
import {
	ClubsEvents,
	ClubsEventsDetailUpdatePreferredColorScheme,
	ClubsPreferredColorScheme,
} from '../types'

const themes: readonly ClubsPreferredColorScheme[] = [
	ClubsPreferredColorScheme.System,
	ClubsPreferredColorScheme.Light,
	ClubsPreferredColorScheme.Dark,
]

/**
 * Normalize the preferred color scheme
 * @param input - preferred color scheme input
 * @returns preferred color scheme
 */

export const normalizePreferredColorScheme = (
	input?: string
): ClubsPreferredColorScheme => {
	return themes.find((t) => t === input) ?? ClubsPreferredColorScheme.System
}

/**
 * Get the preferred color scheme from the localStorage
 * @returns preferred color scheme
 */

export const getPreferredColorScheme = (): ClubsPreferredColorScheme => {
	return ((_cookie: string) => {
		const theme = _cookie
			.split(';')
			.find((c) => c.includes('theme='))
			?.split('=')[1]
		return normalizePreferredColorScheme(theme)
	})(document.cookie)
}

/**
 * Set the preferred color scheme to the localStorage
 * @param theme - preferred color scheme
 * @returns true or an error
 */
export const setPreferredColorScheme = (
	theme: ClubsPreferredColorScheme
): true => {
	// eslint-disable-next-line functional/immutable-data
	document.cookie = `theme=${theme}; max-age=31536000; path=/; secure; samesite=strict`

	document.body.dispatchEvent(
		new CustomEvent<ClubsEventsDetailUpdatePreferredColorScheme>(
			ClubsEvents.UpdatePreferredColorScheme,
			{
				detail: { theme },
				cancelable: true,
			}
		)
	)

	return true
}
