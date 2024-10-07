import { describe, it, expect } from 'vitest'
import { bytes32Hex } from './bytes32Hex'
import { keccak256 } from 'ethers'

describe('bytes32Hex', () => {
	/**
	 * @todo Implement this test
	 */
	it('should returns hex from Uint8Array', () => {
		const str = 'test'
		// change to Uint8Array
		const uint8Array = new Uint8Array(str.length)
		for (let i = 0; i < str.length; i++) {
			uint8Array[i] = str.charCodeAt(i)
		}

		const res = bytes32Hex(uint8Array)
		expect(res).toEqual(
			'0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658'
		)
	})

	it('should returns hex from an array like object', () => {
		const v = { 0: 0, 1: 1, 2: 2, 3: 3 }
		const expected = keccak256(new Uint8Array([0, 1, 2, 3]))

		const res = bytes32Hex(v)
		expect(res).toEqual(expected)
	})

	it('should returns hex from an array-like object has string keys', () => {
		const v = { '0': 0, '1': 1, '2': 2, '3': 3 }
		const expected = keccak256(new Uint8Array([0, 1, 2, 3]))

		const res = bytes32Hex(v)
		expect(res).toEqual(expected)
	})

	it('should returns hex from a array value-like string', () => {
		const v = '0,1,2,3'
		const expected = keccak256(new Uint8Array([0, 1, 2, 3]))

		const res = bytes32Hex(v)
		expect(res).toEqual(expected)
	})

	it('should returns hex from an object-like string', () => {
		const v = JSON.stringify({ '0': 0, '1': 1, '2': 2, '3': 3 })
		const expected = keccak256(new Uint8Array([0, 1, 2, 3]))

		const res = bytes32Hex(v)
		expect(res).toEqual(expected)
	})

	it('should returns a hex like string as is', () => {
		const str = '0x'

		const res = bytes32Hex(str)
		expect(res).toEqual('0x')
	})
})
