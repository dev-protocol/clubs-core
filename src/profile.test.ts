import { describe, it, expect } from 'vitest'
import { fetchProfile } from './profile'

describe('fetchProfile', () => {
	it('should fail when non-valid address is passed', async () => {
		const { error } = await fetchProfile('xzy')
		expect(error?.message).toBe('Invalid address')
	})
})
