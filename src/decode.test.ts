/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
import test from 'ava'
import { encode } from './encode'
import { decode } from './decode'
import { ClubsConfiguration } from './types'

// https://stackoverflow.com/a/12101012
function toBuffer(ab: Uint8Array) {
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
					{ key: 'test:binary', value: new Uint8Array([1, 2, 3]) },
				],
			},
		],
	}
	const encoded = encode(config)
	const res = decode(encoded)
	const bufferified = config.plugins.map((p) => ({
		...p,
		options: p.options.map((o) =>
			o.value instanceof Uint8Array ? { ...o, value: toBuffer(o.value) } : o
		),
	}))
	const expected = {
		...config,
		plugins: bufferified,
	}
	t.deepEqual(res, expected)
})
