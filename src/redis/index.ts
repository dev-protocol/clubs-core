/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-conditional-statements */
import { createClient } from 'redis'

type Options = typeof createClient extends (...args: infer Params) => unknown
	? Params
	: never
export const defaultClient = (options?: Options) =>
	createClient({
		url: process.env.REDIS_URL ?? import.meta.env.REDIS_URL,
		username:
			process.env.REDIS_USERNAME ?? import.meta.env.REDIS_USERNAME ?? '',
		password:
			process.env.REDIS_PASSWORD ?? import.meta.env.REDIS_PASSWORD ?? '',
		...options,
	})

type Redis = ReturnType<typeof defaultClient>

export const Redis = (() => {
	const instances: Map<string, Set<Redis>> = new Map()

	const createInstance = (options?: Options) => {
		console.log('$$$$$', 'new redis connection will be created')
		return defaultClient(options)
	}

	return {
		client: async (params?: { key?: string; options: Options }) => {
			const key = params?.key ?? ''
			const caches = instances.get(key)
			const fromCache = caches?.values().next().value
			const instance = fromCache
				? fromCache
				: ((redis) => {
						if (caches) {
							caches.add(redis)
						} else {
							instances.set(key, new Set([redis]))
						}
						return redis
				  })(createInstance(params?.options))

			if (instance.isOpen === false) {
				await instance.connect()
			}

			if (caches && caches.size > 1) {
				console.log('$$$$$', 'cache size is larger than 1')
				for (const cache of caches.values()) {
					if (cache === instance) {
						continue
					}
					caches.delete(cache)
					cache.quit()
				}
			}
			return instance
		},
	}
})()

/**
 * While debugging this with the following, I've not seen printing `cache size is larger than 1`.
```debug.mjs
import { Redis } from './dist/src/redis/index.mjs'
;(async () => {
	await Promise.all([
		Redis.client(),
		Redis.client(),
		Redis.client(),
		Redis.client(),
		Redis.client(),
		Redis.client(),
		Redis.client(),
		Redis.client(),
		Redis.client(),
		Redis.client(),
	])
	return console.log('done')
})()
```
 * node --env-file=.env debug.mjs
 */
