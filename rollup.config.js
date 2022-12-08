import typescript from '@rollup/plugin-typescript'
import multi from '@rollup/plugin-multi-entry'
import dts from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'

const majorCoreAPIs = [
	'dist/src/authenticate.js',
	'dist/src/decode.js',
	'dist/src/encode.js',
	'dist/src/events.js',
	'dist/src/factory.js',
	'dist/src/layouts/index.js',
	'dist/src/connection/index.js',
]

const astro = () => ({
	name: 'astro',
	resolveId(source) {
		if (source.endsWith('.astro')) {
			return {
				id: `../../../src/layouts${source.replace('./', '/')}`,
				external: true,
			}
		}
	},
})

export default [
	...majorCoreAPIs.map((input) => ({
		input,
		output: [
			{
				file: input,
				format: 'es',
			},
		],
		plugins: [commonjs(), astro()],
	})),
	{
		input: 'dist/src/index.js',
		output: [
			{
				file: 'dist/index.js',
				format: 'es',
			},
		],
		plugins: [commonjs()],
	},
	{
		input: 'dist/src/index.d.ts',
		output: [{ file: 'dist/clubs-core.d.ts', format: 'es' }],
		plugins: [dts()],
	},
]
