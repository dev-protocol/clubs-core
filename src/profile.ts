import { isAddress } from 'ethers'

/**
 * The profile of a user
 */
export type Profile = {
	readonly avatar: string
	readonly username: string
}

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
	readonly profile: Profile | undefined
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
				const profile = (await res.json()) as Profile
				return {
					profile,
					error: undefined,
				}
		  })()
}
