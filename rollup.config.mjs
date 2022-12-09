import typescript from '@rollup/plugin-typescript'
import multi from '@rollup/plugin-multi-entry'
import dts from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'
import { dirname, relative, resolve } from 'path'
import { cwd } from 'process'

const majorCoreAPIs = [
	'dist/src/authenticate.js',
	'dist/src/decode.js',
	'dist/src/encode.js',
	'dist/src/events.js',
	'dist/src/factory.js',
	'dist/src/layouts/index.js',
	'dist/src/connection/index.js',
]

const astro = ({ out } = {}) => ({
	name: 'astro',
	resolveId(source, importer) {
		if (source.endsWith('.astro')) {
			const here = cwd()
			const from = out ?? dirname(importer)
			const originalImporter = importer.replace(`${here}/dist`, here)
			const originalImporterDir = dirname(originalImporter)
			const original = resolve(originalImporterDir, source)
			const relativePath = relative(from, original)
			return {
				id: relativePath,
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
		plugins: [commonjs(), astro()],
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
		plugins: [commonjs()],
	},
	{
		input: 'dist/src/index.d.ts',
		output: [{ file: 'dist/clubs-core.d.ts', format: 'es' }],
		plugins: [dts()],
	},
	...majorCoreAPIs.map((input) => ({
		input: input.replace('.js', '.d.ts'),
		output: [
			{
				file: input
					.replace('.js', '.d.ts')
					.replace('dist/src/', '')
					.replace('/index', ''),
				format: 'es',
			},
		],
		plugins: [dts(), astro({ out: cwd() })],
	})),
]
