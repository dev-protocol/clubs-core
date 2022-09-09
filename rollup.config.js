import typescript from '@rollup/plugin-typescript'
import multi from '@rollup/plugin-multi-entry'
import dts from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'

const majorCoreAPIs = [
	'dist/src/decode.js',
	'dist/src/encode.js',
	'dist/src/events.js',
	'dist/src/factory.js',
	'dist/src/connection/index.js',
]

const astro = () => ({
	name: 'astro',
	resolveId(source) {
		if (source.endsWith('.astro')) {
			return {
				id: `../src/layouts${source.replace('./', '/')}`,
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
				file: input.replace('.js', '.mjs'),
				format: 'es',
			},
			{
				file: input.replace('.js', '.cjs'),
				format: 'cjs',
			},
		],
		plugins: [commonjs()],
	})),
	{
		input: 'dist/src/index.js',
		output: [
			{
				file: 'dist/index.mjs',
				format: 'es',
			},
			{
				file: 'dist/index.cjs',
				format: 'cjs',
			},
		],
		plugins: [astro(), commonjs()],
	},
	{
		input: 'dist/src/index.d.ts',
		output: [{ file: 'dist/clubs-core.d.ts', format: 'es' }],
		plugins: [dts(), astro()],
	},
]
