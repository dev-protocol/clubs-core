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
				id: 'test-plugin',
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
		'bmFtZTogVEVTVAp0d2l0dGVySGFuZGxlOiAiQFRFU1QiCmRlc2NyaXB0aW9uOiAiIgp1cmw6IGh0dHBzOi8vZXhhbXBsZS5jb20KY2hhaW5JZDogMQpycGNVcmw6ICIiCnByb3BlcnR5QWRkcmVzczogIjB4NTQxZjc5MTRlZDJhNGE4YjQ3N2VkYzcxMWZhMzQ5YTc3OTgzZjNhZCIKYWRtaW5Sb2xlUG9pbnRzOiAwCnBsdWdpbnM6CiAgLSBpZDogdGVzdC1wbHVnaW4KICAgIG9wdGlvbnM6CiAgICAgIC0ga2V5OiB0ZXN0OmRhdGUKICAgICAgICB2YWx1ZTogMjAwMS0xMi0xNVQwMjo1OTo0MwogICAgICAtIGtleTogdGVzdDphcnJheQogICAgICAgIHZhbHVlOgogICAgICAgICAgLSB0cnVlCiAgICAgICAgICAtIGZhbHNlCiAgICAgICAgICAtIDkwMDcxOTkyNTQ3NDA5OTEwCiAgICAgIC0ga2V5OiB0ZXN0OmFycmF5aW5hcnJheQogICAgICAgIHZhbHVlOgogICAgICAgICAgLSBhCiAgICAgICAgICAtIC0gYgogICAgICAgICAgICAtIGMKICAgICAgICAgICAgLSAtIGQKICAgICAgICAgICAgICAtIGUKICAgICAgICAgIC0gZgogICAgICAtIGtleTogdGVzdDpyZWNvcmQKICAgICAgICB2YWx1ZToKICAgICAgICAgIGE6CiAgICAgICAgICAgIGI6IGMKICAgICAgICAgICAgZDoKICAgICAgICAgICAgICAtIGUKICAgICAgICAgICAgICAtIGYKICAgICAgLSBrZXk6IHRlc3Q6YmluYXJ5CiAgICAgICAgdmFsdWU6ICEhYmluYXJ5IHwtCiAgICAgICAgICBBUUlECg=='
	t.is(res, expected)
})

test('Specify the type of value will be encoded', (t) => {
	type Value = {
		readonly a: string
		readonly b: bigint
	}
	const value: Value = {
		a: 'TEST',
		b: 1n,
	}
	const res = encode<Value>(value)
	const expected = 'YTogVEVTVApiOiAxCg=='
	t.is(res, expected)
})
