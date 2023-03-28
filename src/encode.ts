import { encode as _encode } from 'js-base64'
import { stringify } from 'yaml'
import type { ClubsConfiguration, ClubsGeneralUnit } from './types'

export const encode = <V extends ClubsGeneralUnit = ClubsConfiguration>(
	value: V
): string =>
	_encode(
		stringify(value, {
			version: '1.2',
			customTags: ['binary', 'timestamp'],
			intAsBigInt: true,
		})
	)
