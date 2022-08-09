import typescript from '@rollup/plugin-typescript'
import multi from '@rollup/plugin-multi-entry'
import dts from 'rollup-plugin-dts'

export default [
	{
		input: ['src/**/*.ts', '!**/*.test.ts'],
		output: [
			{
				file: 'dist/index.mjs',
				format: 'es',
			},
			{
				file: 'dist/index.js',
				format: 'cjs',
			},
		],
		plugins: [multi(), typescript({ module: 'esnext' })],
	},
	{
		input: ['dist/**/*.d.ts', '!**/*.test.d.ts'],
		output: [{ file: 'dist/clubs-core.d.ts', format: 'es' }],
		plugins: [multi(), dts()],
	},
]
