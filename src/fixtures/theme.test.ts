/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-let */
import { describe, it, expect } from 'vitest'
import {
	normalizePreferredColorScheme,
	getPreferredColorScheme,
	setPreferredColorScheme,
} from './theme'
import { ClubsEvents, ClubsPreferredColorScheme } from '../types'

describe('normalizePreferredColorScheme', () => {
	it('should return system theme', () => {
		expect(normalizePreferredColorScheme()).toBe('system')
	})
	it('should return light theme', () => {
		expect(normalizePreferredColorScheme('light')).toBe('light')
	})
	it('should return dark theme', () => {
		expect(normalizePreferredColorScheme('dark')).toBe('dark')
	})
	it('should return system theme when the input is not one of ClubsPreferredColorScheme', () => {
		expect(normalizePreferredColorScheme('xyz')).toBe('system')
	})
})

describe('getPreferredColorScheme', () => {
	it('should return system theme', () => {
		document.cookie = ''
		expect(getPreferredColorScheme()).toBe('system')
	})
	it('should return light theme', () => {
		document.cookie = 'theme=light'
		expect(getPreferredColorScheme()).toBe('light')
	})
	it('should return dark theme', () => {
		document.cookie = 'theme=dark'
		expect(getPreferredColorScheme()).toBe('dark')
	})
})

describe('setPreferredColorScheme', () => {
	it('should return true', () => {
		expect(setPreferredColorScheme(ClubsPreferredColorScheme.System)).toBe(true)
	})
	it('should dispatch event', () => {
		let event: any
		document.body.addEventListener(
			ClubsEvents.UpdatePreferredColorScheme,
			(e) => {
				event = e
			}
		)
		setPreferredColorScheme(ClubsPreferredColorScheme.Light)
		expect(event.detail.theme).toBe(ClubsPreferredColorScheme.Light)
	})
})
