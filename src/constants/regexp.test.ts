import { describe, it, expect } from 'vitest'
import { SinglePath } from './regexp'

describe('SinglePath', () => {
	it('SinglePath matches any string without `/`, `?` and `#`', () => {
		expect('abcd-1234_*($@&^%'.match(SinglePath)?.[0]).toBe('abcd-1234_*($@&^%')
		expect('abcd-1234_*($@&^%-efjk/abcd'.match(SinglePath)?.[0]).toBe(
			'abcd-1234_*($@&^%-efjk'
		)
		expect('abcd-1234_*($@&^%-efj?k/abcd'.match(SinglePath)?.[0]).toBe(
			'abcd-1234_*($@&^%-efj'
		)
		expect('abcd-1234_*($@&^%-ef#j?k/abcd'.match(SinglePath)?.[0]).toBe(
			'abcd-1234_*($@&^%-ef'
		)
	})
})
