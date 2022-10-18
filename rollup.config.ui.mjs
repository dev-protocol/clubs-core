import tailwind from './rollup.plugin.tw.mjs'
import glob from 'glob'

const files = glob.sync('dist/src/ui/**/*.js')

export const createOptions = (file) => ({
	input: file,
	external: file.includes('/index.js') ? [/.*/] : [/.*webcomponents.*/],
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
		tailwind({
			include: 'ui/**/*',
		}),
	],
})

export default files.map(createOptions)
