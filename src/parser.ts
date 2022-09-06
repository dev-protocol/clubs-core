export type BytesLike = Uint8Array | readonly number[] | Record<number, number>

export const toBytes = (value: BytesLike): Uint8Array => {
	return value instanceof Array
		? Uint8Array.from(value)
		: Uint8Array.from(Object.values(value))
}
