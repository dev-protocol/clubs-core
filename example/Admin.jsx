/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statement */
import { setOptions } from '../src/events'

export default (props) => {
	console.log({ props })

	setTimeout(() => {
		setOptions([{ key: 'k', value: 1 }], props.currentPluginIndex)
	}, 1000)

	return <p>Example</p>
}
