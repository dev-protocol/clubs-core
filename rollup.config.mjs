import dts from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'
import { dirname, relative, resolve } from 'path'
import { cwd } from 'process'

const majorCoreAPIs = [
	'dist/src/layouts/index.js',
	'dist/src/images/index.js',
	'dist/src/connection/index.js',
	'dist/src/styles/index.js',
	'dist/src/redis/index.js',
]

export const useSrc = ({ out, ext } = {}) => ({
	name: 'astro',
	resolveId(source, importer) {
		if (ext.some((e) => source.endsWith(e))) {
			const here = cwd()
			const from =
				typeof out === 'string'
					? out
					: dirname(typeof out === 'function' ? out(importer) : importer)
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
		plugins: [commonjs(), useSrc({ ext: ['.astro', '.scss', '.css', '.svg'] })],
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
		plugins: [
			dts(),
			useSrc({ out: cwd(), ext: ['.astro', '.scss', '.css', '.svg'] }),
		],
	})),
]
