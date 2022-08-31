import typescript from '@rollup/plugin-typescript'
import multi from '@rollup/plugin-multi-entry'
import dts from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'

export default [
	{
		input: 'src/index.ts',
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
		plugins: [commonjs(), typescript({ module: 'esnext' })],
	},
	{
		input: 'src/connection/index.ts',
		output: [
			{
				file: 'connection/index.mjs',
				format: 'es',
			},
			{
				file: 'connection/index.cjs',
				format: 'cjs',
			},
		],
		plugins: [commonjs(), typescript({ module: 'esnext' })],
	},
	{
		input: 'dist/src/index.d.ts',
		output: [{ file: 'dist/clubs-core.d.ts', format: 'es' }],
		plugins: [dts()],
	},
	{
		input: 'dist/src/connection/index.d.ts',
		output: [{ file: 'connection/index.d.ts', format: 'es' }],
		plugins: [dts()],
	}
]
