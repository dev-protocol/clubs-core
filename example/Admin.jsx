/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statement */
import { buildConfig, setOptions } from '../src/events'

export default (props) => {
	console.log({ props })

	setTimeout(() => {
		setOptions([{ key: 'k', value: 1 }], props.clubs.currentPluginIndex)
	}, 1000)

	setTimeout(() => {
		buildConfig()
	}, 2000)

	return <p>Example</p>
}
