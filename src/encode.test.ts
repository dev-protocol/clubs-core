import test from 'ava'
import { encode } from './encode'
import { ClubsConfiguration } from './types'

test('Returns base64 encoded yaml string', (t) => {
	const config: ClubsConfiguration = {
		name: 'TEST',
		twitterHandle: '@TEST',
		description: '',
		url: 'https://example.com',
		chainId: 1,
		rpcUrl: '',
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
		'bmFtZTogVEVTVAp0d2l0dGVySGFuZGxlOiAiQFRFU1QiCmRlc2NyaXB0aW9uOiAiIgp1cmw6IGh0dHBzOi8vZXhhbXBsZS5jb20KY2hhaW5JZDogMQpycGNVcmw6ICIiCnByb3BlcnR5QWRkcmVzczogIjB4NTQxZjc5MTRlZDJhNGE4YjQ3N2VkYzcxMWZhMzQ5YTc3OTgzZjNhZCIKYWRtaW5Sb2xlUG9pbnRzOiAwCnBsdWdpbnM6CiAgLSBuYW1lOiB0ZXN0LXBsdWdpbgogICAgb3B0aW9uczoKICAgICAgLSBrZXk6IHRlc3Q6ZGF0ZQogICAgICAgIHZhbHVlOiAyMDAxLTEyLTE1VDAyOjU5OjQzCiAgICAgIC0ga2V5OiB0ZXN0OmFycmF5CiAgICAgICAgdmFsdWU6CiAgICAgICAgICAtIHRydWUKICAgICAgICAgIC0gZmFsc2UKICAgICAgICAgIC0gOTAwNzE5OTI1NDc0MDk5MTAKICAgICAgLSBrZXk6IHRlc3Q6YXJyYXlpbmFycmF5CiAgICAgICAgdmFsdWU6CiAgICAgICAgICAtIGEKICAgICAgICAgIC0gLSBiCiAgICAgICAgICAgIC0gYwogICAgICAgICAgICAtIC0gZAogICAgICAgICAgICAgIC0gZQogICAgICAgICAgLSBmCiAgICAgIC0ga2V5OiB0ZXN0OnJlY29yZAogICAgICAgIHZhbHVlOgogICAgICAgICAgYToKICAgICAgICAgICAgYjogYwogICAgICAgICAgICBkOgogICAgICAgICAgICAgIC0gZQogICAgICAgICAgICAgIC0gZgogICAgICAtIGtleTogdGVzdDpiaW5hcnkKICAgICAgICB2YWx1ZTogISFiaW5hcnkgfC0KICAgICAgICAgIEFRSUQK'
	t.is(res, expected)
})
