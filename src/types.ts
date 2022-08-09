export type ClubsPluginOption = {
	readonly key: string
	readonly value?: string | number | boolean | Date | Uint8Array
}

export type ClubsPlugin = {
	readonly name: string
	readonly options: readonly ClubsPluginOption[]
}

export type ClubsConfiguration = {
	readonly id: string
	readonly plugins: readonly ClubsPlugin[]
}
