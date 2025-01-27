import type { AstroIntegration } from 'astro'
import type { ClubsAstroIntegrationOptions } from './types'

export const astro = function (
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	options?: ClubsAstroIntegrationOptions
): AstroIntegration {
	return {
		name: '@devprotocol/clubs-core',
		hooks: {
			'astro:config:setup': async ({ updateConfig }) => {
				// eslint-disable-next-line functional/no-expression-statements
				updateConfig({
					vite: {
						ssr: {
							noExternal: [/^.*clubs-plugin.*$/],
						},
						optimizeDeps: {
							include: [
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
								'isomorphic-dompurify',
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
								'toposort',
								'void-elements',
							],
						},
					},
				})
			},
		},
	}
}
