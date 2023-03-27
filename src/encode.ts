import { encode as _encode } from 'js-base64'
import { stringify } from 'yaml'
import type { ClubsConfiguration, ClubsPluginOptionValue } from './types'

export const encode = <V extends ClubsPluginOptionValue = ClubsConfiguration>(
	value: V
): string =>
	_encode(
		stringify(value, {
			version: '1.2',
			customTags: ['binary', 'timestamp'],
			intAsBigInt: true,
		})
	)
