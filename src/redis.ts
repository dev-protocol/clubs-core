import { createClient } from 'redis'

type RedisClient = ReturnType<typeof createClient>
type RedisConfiguration = {
	readonly url?: string
	readonly username?: string
	readonly password?: string
}

const Redis = (function () {
	const client = new Map<string, RedisClient>()
	const defaultClient = 'default'

	function createInstance(options: RedisConfiguration = {}) {
		const redisClient = createClient({
			...{
				url: import.meta.env.REDIS_URL,
				username: import.meta.env.REDIS_USERNAME ?? '',
				password: import.meta.env.REDIS_PASSWORD ?? '',
			},
			...options,
		})

		/**
		 * TODO: We can add some process to handle auto-disconnect...
		 */

		return redisClient
	}

	return {
		getClient: async function (
			name: string = defaultClient,
			options: RedisConfiguration = {}
		): Promise<RedisClient> {
			const redis =
				client.get(name) ??
				(client.set(name, createInstance(options)).get(name) as RedisClient)
			// eslint-disable-next-line functional/no-conditional-statement
			if (redis.isOpen === false) {
				// eslint-disable-next-line functional/no-expression-statement
				await redis.connect()
			}
			return redis
		},
	}
})()

export const getRedisClient = async (
	name = 'default',
	options: RedisConfiguration = {}
) => {
	return Redis.getClient(name, options)
}
