/* eslint-disable functional/no-expression-statement */
import { Connection, getConnection } from '@devprotocol/elements'
import { define } from '@aggre/ullr'
import { CONNECTION_ID } from '.'

export const connection = (id: string = CONNECTION_ID): Connection => {
	define(Connection)
	const el =
		getConnection(id) ??
		((e) => {
			e.setAttribute('id', id)
			document.body.appendChild(e)
			return e
		})(document.createElement(Connection.is))
	return el as Connection
}
