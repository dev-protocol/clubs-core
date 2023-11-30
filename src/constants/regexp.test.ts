import test from 'ava'
import { SinglePath } from './regexp'

test('SinglePath matches any string without `/`, `?` and `#`', (t) => {
	t.is('abcd-1234_*($@&^%'.match(SinglePath)?.[0], 'abcd-1234_*($@&^%')
	t.is(
		'abcd-1234_*($@&^%-efjk/abcd'.match(SinglePath)?.[0],
		'abcd-1234_*($@&^%-efjk'
	)
	t.is(
		'abcd-1234_*($@&^%-efj?k/abcd'.match(SinglePath)?.[0],
		'abcd-1234_*($@&^%-efj'
	)
	t.is(
		'abcd-1234_*($@&^%-ef#j?k/abcd'.match(SinglePath)?.[0],
		'abcd-1234_*($@&^%-ef'
	)
})
