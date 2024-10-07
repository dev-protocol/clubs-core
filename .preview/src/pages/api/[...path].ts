import { apiFactory } from '../../../../src/factory'
import { encode } from '../../../../src'
import example from '../../../../example/index'
import theme from '../../../../example/theme'

export const { ALL } = apiFactory({
	config: () =>
		encode({
			name: 'Debug',
			twitterHandle: '@debug',
			description: '',
			url: '',
			propertyAddress: '',
			chainId: 167,
			rpcUrl: '',
			adminRolePoints: 0,
			options: [],
			plugins: [
				{ id: 'theme', options: [] },
				{ id: 'example', options: [{ hey: 'Hello' }] },
			],
		}),
	plugins: [theme, example],
})
