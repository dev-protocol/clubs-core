import { decode } from './decode'
import { ClubsConfiguration, ClubsFunctionConfigFetcher } from './types'

export const getClubsConfig: (
	fetcher: ClubsFunctionConfigFetcher
) => Promise<ClubsConfiguration> = async (fetcher) => {
	const config = await fetcher(Astro.params)
	const decoded = decode(config)
	return decoded
}
