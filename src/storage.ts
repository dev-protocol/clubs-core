import type { PutBlobResult } from '@vercel/blob'
import { isNotError, whenDefinedAll } from '@devprotocol/util-ts'

export const uploadFile = async ({
	file,
	signature,
	message,
}: {
	readonly file: File
	readonly signature?: string
	readonly message?: string
}) => {
	const formData = new FormData()
	// eslint-disable-next-line functional/no-expression-statement
	formData.append('file', file)

	const params = new URLSearchParams()

	// eslint-disable-next-line functional/no-expression-statement, functional/no-return-void
	whenDefinedAll([signature, message], ([sig, msg]) => {
		// eslint-disable-next-line functional/no-expression-statement
		params.append('signature', sig)
		// eslint-disable-next-line functional/no-expression-statement
		params.append('message', msg)
	})

	const response = await fetch(
		`https://storage.clubs.place/api/blob?${params.toString()}`,
		{
			method: 'POST',
			body: formData,
		}
	).catch((err: Error) => err)

	const result = isNotError(response)
		? await response
				.json()
				.then((r) => r as PutBlobResult)
				.catch((err: Error) => err)
		: response
	return result
}
