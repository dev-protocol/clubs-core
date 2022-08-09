import test from 'ava'
import { encode } from './encode'
import { ClubsConfiguration } from './types'

test('Returns base64 encoded yaml string', (t) => {
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
	const res = encode(config)
	const expected =
		'aWQ6IHRlc3QKcGx1Z2luczoKICAtIG5hbWU6IHRlc3QtcGx1Z2luCiAgICBvcHRpb25zOgogICAgICAtIGtleTogdGVzdDpkYXRlCiAgICAgICAgdmFsdWU6IDIwMDEtMTItMTRUMTc6NTk6NDMKICAgICAgLSBrZXk6IHRlc3Q6YmluYXJ5CiAgICAgICAgdmFsdWU6ICEhYmluYXJ5IHwtCiAgICAgICAgICBBUUlECg=='
	t.is(res, expected)
})
