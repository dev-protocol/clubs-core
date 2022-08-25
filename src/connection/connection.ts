import { Connection, getConnection } from '@devprotocol/elements'
import { CONNECTION_ID } from './constants'

export const connection = (id: string = CONNECTION_ID): Connection =>
	getConnection(id)
