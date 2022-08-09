import { encode as _encode } from 'js-base64'
import { stringify } from 'yaml'
import type { ClubsConfiguration } from './types'

export const encode = (config: ClubsConfiguration): string =>
	_encode(
		stringify(config, {
			version: '1.2',
			customTags: ['binary', 'timestamp'],
			intAsBigInt: true,
		})
	)
