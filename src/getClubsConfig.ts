import { decode } from './decode'
import { encode } from './encode'
import type { ClubsConfiguration, ClubsFunctionConfigFetcher } from './types'

export const getClubsConfig: (
	fetcher: ClubsFunctionConfigFetcher
) => Promise<readonly [ClubsConfiguration, string]> = async (fetcher) => {
	const config = await fetcher()
	const encoded = typeof config === 'string' ? config : encode(config)
	const decoded = typeof config === 'string' ? decode(config) : config
	return [decoded, encoded]
}
