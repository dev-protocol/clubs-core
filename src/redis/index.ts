import { createClient } from 'redis'

type Options = typeof createClient extends (...args: infer Params) => unknown
	? Params
	: never
export const defaultClient = (options?: Options) =>
	createClient({
		url: import.meta.env.REDIS_URL,
		username: import.meta.env.REDIS_USERNAME ?? '',
		password: import.meta.env.REDIS_PASSWORD ?? '',
		...options,
	})

type Redis = ReturnType<typeof defaultClient>

export const Redis = (() => {
	const instances: Map<string, Redis> = new Map()

	const createInstance = (options?: Options) => {
		// eslint-disable-next-line functional/no-expression-statements
		console.log('$$$$$', 'new redis connection will be created')
		return defaultClient(options)
	}

	return {
		client: async (params?: { key?: string; options: Options }) => {
			const key = params?.key ?? ''
			const fromCache = instances.get(key)
			const instance = fromCache
				? fromCache
				: (instances
						.set(key, createInstance(params?.options))
						.get(key) as Redis)
			// eslint-disable-next-line functional/no-conditional-statements
			if (instance.isOpen === false) {
				// eslint-disable-next-line functional/no-expression-statements
				await instance.connect()
			}
			return instance
		},
	}
})()
