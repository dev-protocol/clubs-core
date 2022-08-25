import { Connection, getConnection } from '@devprotocol/elements'
import { CONNECTION_ID } from '.'

export const connection = (id: string = CONNECTION_ID): Connection =>
	getConnection(id)
