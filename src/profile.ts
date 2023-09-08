import { isAddress } from 'ethers'
import type { ClubsProfile } from './types'

/**
 * Fetches the profile of the user
 *
 * @param {string} address - The wallet adddress of the user
 *
 * @example
 *
 * ```ts
 * import { fetchProfile } from '@devprotocol/clubs-core'
 *
 * const { profile, error } = await fetchProfile('0x...')
 * ```
 */
export const fetchProfile = async (
	address: string
): Promise<{
	readonly profile: ClubsProfile | undefined
	readonly error: Error | undefined
}> => {
	return !isAddress(address)
		? {
				profile: undefined,
				error: new Error('Invalid address'),
		  }
		: (async () => {
				const apiEndpoint = `https://clubs.place/api/profile/${address}`

				const res = await fetch(apiEndpoint)

				return res.ok
					? (async () => {
							const profile = (await res.json()) as ClubsProfile
							return {
								profile,
								error: undefined,
							}
					  })()
					: {
							profile: undefined,
							error: new Error(`Error fetching profile at ${apiEndpoint}`),
					  }
		  })()
}
