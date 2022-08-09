/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
import test from 'ava'
import { encode } from './encode'
import { decode } from './decode'
import { ClubsConfiguration } from './types'

// https://stackoverflow.com/a/12101012
function toBuffer(ab: ArrayBuffer) {
	const buf = Buffer.alloc(ab.byteLength)
	const view = new Uint8Array(ab)
	for (let i = 0; i < buf.length; ++i) {
		buf[i] = view[i]
	}
	return buf
}

test('Returns decoded configuration', (t) => {
	const config: ClubsConfiguration = {
		id: 'test',
		plugins: [
			{
				name: 'test-plugin',
				options: [
					{ key: 'test:date', value: new Date('2001-12-15T02:59:43') },
					{
						key: 'test:binary',
						// Instances of Buffer are also instances of Uint8Array in node.js 4.x and higher.
						// You can also tell by the fact that no type error is thrown.
						// But `deepEqual` test doesn't allow it, so buffer it here.
						value: toBuffer(new Uint8Array([1, 2, 3]).buffer),
					},
				],
			},
		],
	}
	const encoded = encode(config)
	const res = decode(encoded)
	t.deepEqual(res, config)
})
