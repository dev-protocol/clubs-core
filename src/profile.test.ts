import test from 'ava'
import { fetchProfile } from './profile'

test('should fail when non-valid address is passed', async (t) => {
	const { error } = await fetchProfile('xzy')
	t.is(error?.message, 'Invalid address')
})
