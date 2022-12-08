import tailwind from './rollup.plugin.tw.js'
import glob from 'glob'
// import { litScss } from 'rollup-plugin-scss-lit'

const files = glob.sync('dist/src/ui/**/*.js')

export const createOptions = (file) => ({
	input: file,
	external: file.includes('/index.js') ? [/.*/] : [/.*webcomponents.*/],
	output: [
		{
			file,
			format: 'es',
		},
	],
	plugins: [
		tailwind({
			include: 'ui/**/*',
		}),
		// litScss({
		// 	minify: process.env.NODE_ENV === 'production',
		// 	options: { loadPaths: ['node_modules'] }
		// })
	],
})

export default files.map(createOptions)
