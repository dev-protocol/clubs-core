import test from 'ava'
import { encode } from './encode'
import { ClubsConfiguration } from './types'

test('Returns base64 encoded yaml string', (t) => {
	const config: ClubsConfiguration = {
		name: 'TEST',
		twitterHandle: '@TEST',
		description: '',
		url: 'https://example.com',
		propertyAddress: '0x541f7914ed2a4a8b477edc711fa349a77983f3ad',
		adminRolePoints: 0,
		plugins: [
			{
				name: 'test-plugin',
				options: [
					{ key: 'test:date', value: new Date('2001-12-15T02:59:43Z') },
					{
						key: 'test:array',
						value: [true, false, BigInt(Number.MAX_SAFE_INTEGER) * 10n],
					},
					{
						key: 'test:arrayinarray',
						value: ['a', ['b', 'c', ['d', 'e']], 'f'],
					},
					{ key: 'test:record', value: { a: { b: 'c', d: ['e', 'f'] } } },
					{ key: 'test:binary', value: new Uint8Array([1, 2, 3]) },
				],
			},
		],
	}
	const res = encode(config)
	const expected =
		'bmFtZTogVEVTVAp0d2l0dGVySGFuZGxlOiAiQFRFU1QiCmRlc2NyaXB0aW9uOiAiIgp1cmw6IGh0dHBzOi8vZXhhbXBsZS5jb20KcHJvcGVydHlBZGRyZXNzOiAiMHg1NDFmNzkxNGVkMmE0YThiNDc3ZWRjNzExZmEzNDlhNzc5ODNmM2FkIgphZG1pblJvbGVQb2ludHM6IDAKcGx1Z2luczoKICAtIG5hbWU6IHRlc3QtcGx1Z2luCiAgICBvcHRpb25zOgogICAgICAtIGtleTogdGVzdDpkYXRlCiAgICAgICAgdmFsdWU6IDIwMDEtMTItMTVUMDI6NTk6NDMKICAgICAgLSBrZXk6IHRlc3Q6YXJyYXkKICAgICAgICB2YWx1ZToKICAgICAgICAgIC0gdHJ1ZQogICAgICAgICAgLSBmYWxzZQogICAgICAgICAgLSA5MDA3MTk5MjU0NzQwOTkxMAogICAgICAtIGtleTogdGVzdDphcnJheWluYXJyYXkKICAgICAgICB2YWx1ZToKICAgICAgICAgIC0gYQogICAgICAgICAgLSAtIGIKICAgICAgICAgICAgLSBjCiAgICAgICAgICAgIC0gLSBkCiAgICAgICAgICAgICAgLSBlCiAgICAgICAgICAtIGYKICAgICAgLSBrZXk6IHRlc3Q6cmVjb3JkCiAgICAgICAgdmFsdWU6CiAgICAgICAgICBhOgogICAgICAgICAgICBiOiBjCiAgICAgICAgICAgIGQ6CiAgICAgICAgICAgICAgLSBlCiAgICAgICAgICAgICAgLSBmCiAgICAgIC0ga2V5OiB0ZXN0OmJpbmFyeQogICAgICAgIHZhbHVlOiAhIWJpbmFyeSB8LQogICAgICAgICAgQVFJRAo='
	t.is(res, expected)
})
