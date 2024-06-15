import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'
import { tags, attrs } from './constants/dompurify'

const renderer = {
	link(href: string, _: string | null | undefined, text: string) {
		const url = new URL(href)
		const youtube = url.host === 'youtube.com' || url.host === 'www.youtube.com'
		const v = url.searchParams.get('v')

		return youtube
			? `<iframe class="youtube aspect-video mx-auto w-full rounded" src="https://www.youtube.com/embed/${v}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
			: `<a href="${href}">${text}</a>`
	},
}

const parser = marked.use({ renderer })

/**
 * Parses the given markdown content and returns sanitized HTML.
 *
 * @param content The markdown content to parse.
 * @returns The sanitized HTML representation of the parsed markdown.
 */
export const markdownToHtml = (content = '') => {
	return DOMPurify.sanitize(parser.parse(content), {
		ALLOWED_TAGS: [...tags, 'iframe'],
		ALLOWED_ATTR: [
			...attrs,
			'src',
			'frameborder',
			'allow',
			'onmousewheel',
			'width',
			'height',
			'style',
		],
	})
}
