import { createFilter } from '@rollup/pluginutils'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

function transform(purgeFiles) {
	const plugins = [
		tailwindcss({
			config: {
				content: {
					files: [...purgeFiles],
					transform: (content) =>
						content.replace('static styles = ', 'styles ='),
				},
				separator: ':',
			},
		}),
		autoprefixer,
	]
	return postcss(plugins).process('@tailwind utilities;', {
		from: undefined,
		to: undefined,
	})
}

const defaultOptions = {
	include: undefined,
	exclude: undefined,
}
const placeholder = '/*_tailwind_*/'

export default function litTailwindcss(options = defaultOptions) {
	const filter = createFilter(options.include, options.exclude)
	const ids = new Set()

	return {
		moduleParsed({ id }) {
			if (filter(id)) ids.add(id)
		},
		async renderChunk(code) {
			if (code.includes(placeholder)) {
				const result = await transform(Array.from(ids))
				if (result.css) {
					return code.replace(placeholder, `${result.css.replace(/:/g, '\\:')}`)
				}
				return null
			}
			return null
		},
	}
}
