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
					{ key: 'test:date', value: new Date('2001-12-15T02:59:43Z') },
					{
						key: 'test:array',
						value: [true, false, BigInt(Number.MAX_SAFE_INTEGER) * 10n],
					},
					{ key: 'test:binary', value: new Uint8Array([1, 2, 3]) },
				],
			},
		],
	}
	const res = encode(config)
	const expected =
		'aWQ6IHRlc3QKcGx1Z2luczoKICAtIG5hbWU6IHRlc3QtcGx1Z2luCiAgICBvcHRpb25zOgogICAgICAtIGtleTogdGVzdDpkYXRlCiAgICAgICAgdmFsdWU6IDIwMDEtMTItMTVUMDI6NTk6NDMKICAgICAgLSBrZXk6IHRlc3Q6YXJyYXkKICAgICAgICB2YWx1ZToKICAgICAgICAgIC0gdHJ1ZQogICAgICAgICAgLSBmYWxzZQogICAgICAgICAgLSA5MDA3MTk5MjU0NzQwOTkxMAogICAgICAtIGtleTogdGVzdDpiaW5hcnkKICAgICAgICB2YWx1ZTogISFiaW5hcnkgfC0KICAgICAgICAgIEFRSUQK'
	t.is(res, expected)
})
