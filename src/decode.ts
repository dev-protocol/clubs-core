import { decode as _decode } from 'js-base64'
import { parse } from 'yaml'
import type { ClubsConfiguration } from './types'

export const decode = (config: string): ClubsConfiguration =>
	parse(_decode(config), {
		version: '1.2',
		customTags: ['binary', 'timestamp'],
		intAsBigInt: true,
	})
