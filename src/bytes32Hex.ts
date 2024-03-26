import { arrayify } from '@devprotocol/dev-kit'
import { keccak256 } from 'ethers'
import { always, tryCatch } from 'ramda'

export const bytes32Hex = (
	payload: string | Uint8Array | { readonly [key: number]: number }
) => {
	const v: string | Uint8Array =
		typeof payload === 'string'
			? /^[0-9][0-9,]*[0-9]$/.test(payload)
				? new Uint8Array(payload.split(',').map(Number))
				: tryCatch(
						(str: string) => new Uint8Array(arrayify(JSON.parse(str))),
						always(payload)
				  )(payload)
			: payload instanceof Uint8Array
			? payload
			: new Uint8Array(arrayify(payload))
	return typeof v === 'string' ? v : keccak256(v)
}
