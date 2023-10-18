/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
import test from 'ava'
import { bytes32Hex } from './bytes32Hex'

/**
 * @todo Implement this test
 */
test('Passing a UInt8Array returns keccak256(val)', (t) => {
	const str = 'test'
	// change to Uint8Array
	const uint8Array = new Uint8Array(str.length)
	for (let i = 0; i < str.length; i++) {
		uint8Array[i] = str.charCodeAt(i)
	}

	const res = bytes32Hex(uint8Array)
	t.deepEqual(
		res,
		'0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658'
	)
})

test('Passing a string returns itself', (t) => {
	const str = 'test'

	const res = bytes32Hex(str)
	t.deepEqual(res, 'test')
})
