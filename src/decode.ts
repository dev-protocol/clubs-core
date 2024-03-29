import { decode as _decode } from 'js-base64'
import { parse } from 'yaml'
import type { ClubsConfiguration, ClubsGeneralUnit } from './types'

export const decode = <R extends ClubsGeneralUnit = ClubsConfiguration>(
	value: string
): R =>
	parse(
		_decode(value),
		(key, value) => {
			return typeof value === 'bigint' && value <= Number.MAX_SAFE_INTEGER
				? Number(value)
				: value
		},
		{
			version: '1.2',
			customTags: ['binary', 'timestamp'],
			intAsBigInt: true,
		}
	)
