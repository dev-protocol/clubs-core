import { dts } from 'rollup-plugin-dts'
import commonjs from '@rollup/plugin-commonjs'
import { useSrc } from './rollup.config.mjs'
import tailwind from './rollup.plugin.tw.mjs'
import { globSync } from 'glob'
import { cwd } from 'process'
// import { litScss } from 'rollup-plugin-scss-lit'

const files = globSync('dist/src/ui/*/*.js')

const ext = ['.astro', '.vue', '.svelte', '.css', '.scss']

export const createOptions = (file) => ({
	input: file,
	external: [/.*webcomponents.*/],
	output: [
		{
			file: file.replace('.js', '.mjs'),
			format: 'es',
		},
		{
			file: file.replace('.js', '.cjs'),
			format: 'cjs',
		},
	],
	plugins: [
		commonjs(),
		useSrc({ ext }),
		tailwind({
			include: 'ui/**/*',
		}),
		// litScss({
		// 	minify: process.env.NODE_ENV === 'production',
		// 	options: { loadPaths: ['node_modules'] }
		// })
	],
})

export default [
	...files.map(createOptions),
	...files.map((input) => ({
		input: input.replace('.js', '.d.ts'),
		output: [
			{
				file: input.replace('.js', '.d.ts').replace('dist/src/', ''),
				format: 'es',
			},
		],
		plugins: [
			dts(),
			useSrc({
				out: cwd(),
				ext,
			}),
		],
	})),
]
