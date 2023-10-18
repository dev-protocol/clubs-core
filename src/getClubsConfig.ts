import { decode } from './decode'
import type { ClubsConfiguration, ClubsFunctionConfigFetcher } from './types'

export const getClubsConfig: (
	fetcher: ClubsFunctionConfigFetcher
) => Promise<readonly [ClubsConfiguration, string]> = async (fetcher) => {
	const config = await fetcher()
	const decoded = decode(config)
	return [decoded, config]
}
