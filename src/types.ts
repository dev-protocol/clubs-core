export type ClubsPluginOptionValue =
	| string
	| number
	| boolean
	| Date
	| bigint
	| Uint8Array
	| readonly ClubsPluginOptionValue[]
	| {
			readonly [key: string]: ClubsPluginOptionValue
	  }

export type ClubsPluginOption = {
	readonly key: string
	readonly value?: ClubsPluginOptionValue
}

export type ClubsPlugin = {
	readonly name: string
	readonly options: readonly ClubsPluginOption[]
}

export type ClubsConfiguration = {
	readonly id: string
	readonly plugins: readonly ClubsPlugin[]
}
