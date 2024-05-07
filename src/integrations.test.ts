import { describe, it, expect, vi } from 'vitest'
import { astro } from './integrations'

describe('astro', () => {
	it('should return `@devprotocol/clubs-core` as name', async () => {
		const { name } = astro()
		expect(name).toBe('@devprotocol/clubs-core')
	})
	it('should return a function as hooks.astro:config:setup', async () => {
		const { hooks } = astro()
		expect(hooks['astro:config:setup']).toBeInstanceOf(Function)
	})

	describe('calling updateConfig in hooks.astro:config:setup', () => {
		const updateConfig = vi.fn()

		it('should pass the predefined value as vite.ssr.noExternal', async () => {
			const expected = [/^.*clubs-plugin.*$/]

			const { hooks } = astro()
			const hook = hooks['astro:config:setup']
			await hook!({ updateConfig } as any)
			expect(updateConfig.mock.lastCall[0].vite.ssr.noExternal).toEqual(
				expected
			)
		})

		it('should pass the predefined value as vite.optimizeDeps.include', async () => {
			// These are cjs modules commonly used in dapps.
			const expected = [
				'@coinbase/wallet-sdk',
				'@solana/buffer-layout',
				'@stablelib/chacha20poly1305',
				'@stablelib/ed25519',
				'@stablelib/hkdf',
				'@stablelib/random',
				'@stablelib/sha256',
				'@stablelib/x25519',
				'@walletconnect/environment',
				'@walletconnect/heartbeat',
				'@walletconnect/jsonrpc-utils',
				'@walletconnect/logger',
				'@walletconnect/time',
				'@walletconnect/window-getters',
				'@walletconnect/window-metadata',
				'bigint-buffer',
				'bn.js',
				'borsh',
				'bs58',
				'buffer',
				'buffer/index.js',
				'country-list',
				'eventemitter3',
				'events',
				'hoist-non-react-statics',
				'isomorphic-unfetch',
				'jayson',
				'jayson/lib/client/browser',
				'lodash',
				'lodash.isequal',
				'lodash/camelCase',
				'lodash/has',
				'lodash/mapKeys',
				'lodash/mapValues',
				'lodash/snakeCase',
				'prop-types',
				'property-expr',
				'qrcode',
				'query-string',
				'react-fast-compare',
				'rpc-websockets/dist/lib/client',
				'rpc-websockets/dist/lib/client/websocket.browser',
				'toposort',
				'void-elements',
			]

			const { hooks } = astro()
			const hook = hooks['astro:config:setup']
			await hook!({ updateConfig } as any)
			expect(updateConfig.mock.lastCall[0].vite.optimizeDeps.include).toEqual(
				expected
			)
		})

		it('should pass the predefined value as vite.resolve.alias', async () => {
			const expected = {
				'@walletconnect/jsonrpc-utils':
					'@walletconnect/jsonrpc-utils/dist/umd/index.min.js',
			}

			const { hooks } = astro()
			const hook = hooks['astro:config:setup']
			await hook!({ updateConfig } as any)
			expect(updateConfig.mock.lastCall[0].vite.resolve.alias).toEqual(expected)
		})
	})
})
