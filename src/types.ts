export type ClubsPluginOptionValue =
	| string
	| number
	| boolean
	| Date
	| bigint
	| Uint8Array

export type ClubsPluginOption = {
	readonly key: string
	readonly value?: ClubsPluginOptionValue | readonly ClubsPluginOptionValue[]
}

export type ClubsPlugin = {
	readonly name: string
	readonly options: readonly ClubsPluginOption[]
}

export type ClubsConfiguration = {
	readonly id: string
	readonly plugins: readonly ClubsPlugin[]
}
