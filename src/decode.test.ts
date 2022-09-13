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
		name: 'TEST',
		twitterHandle: '@TEST',
		description: '',
		url: 'https://example.com',
		propertyAddress: '0x541f7914ed2a4a8b477edc711fa349a77983f3ad',
		plugins: [
			{
				name: 'test-plugin',
				options: [
					{ key: 'test:date', value: new Date('2001-12-15T02:59:43Z') },
					{ key: 'test:number', value: 1 },
					{ key: 'test:float', value: 0.1 },
					{
						key: 'test:array',
						value: [true, false, BigInt(Number.MAX_SAFE_INTEGER) * 10n],
					},
					{
						key: 'test:arrayinarray',
						value: ['a', ['b', 'c', ['d', 'e']], 'f'],
					},
					{ key: 'test:record', value: { a: { b: 'c', d: ['e', 'f'] } } },
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

test('Bigint less than or equal MAX_SAFE_INTEGER is handled as a number', (t) => {
	const config: ClubsConfiguration = {
		name: '',
		twitterHandle: '',
		description: '',
		url: '',
		propertyAddress: '',
		plugins: [
			{
				name: '',
				options: [
					{ key: '', value: 1n },
					{ key: '', value: Number.MAX_SAFE_INTEGER },
				],
			},
		],
	}
	const encoded = encode(config)
	const res = decode(encoded)
	t.is(res.plugins[0].options[0].value, 1)
	t.is(res.plugins[0].options[1].value, Number.MAX_SAFE_INTEGER)
})
