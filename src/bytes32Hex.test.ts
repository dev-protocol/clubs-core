/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
import { describe, it, expect } from 'vitest'
import { bytes32Hex } from './bytes32Hex'

describe('bytes32Hex', () => {
	/**
	 * @todo Implement this test
	 */
	it('Passing a UInt8Array returns keccak256(val)', () => {
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

	it('Passing a string returns itself', () => {
		const str = 'test'

		const res = bytes32Hex(str)
		expect(res).toEqual('test')
	})
})
