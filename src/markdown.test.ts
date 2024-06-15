/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
import { describe, it, expect } from 'vitest'
import { markdownToHtml } from './markdown'

describe('markdownToHtml', () => {
	it('should return string html', () => {
		const res = markdownToHtml('# Hello')

		expect(res).toEqual(`<h1>Hello</h1>\n`)
	})

	it('should accept iframe, and frameborder/onmousewheel/allow attributes', () => {
		const res = markdownToHtml(
			'# Hello\n\n<iframe src="https://example.com" frameborder onmousewheel allow="autoplay"></iframe>'
		)

		expect(res).toEqual(
			`<h1>Hello</h1>\n<iframe allow="autoplay" onmousewheel="" frameborder="" src="https://example.com"></iframe>`
		)
	})

	it('should accept img, and src/width/height attributes', () => {
		const res = markdownToHtml(
			'# Hello\n\n<img src="https://example.com" width="50" height="50" />'
		)

		expect(res).toEqual(
			`<h1>Hello</h1>\n<img height="50" width="50" src="https://example.com">`
		)
	})

	it('should convert youtube url to the embed url', () => {
		const res = markdownToHtml('https://www.youtube.com/watch?v=6RAtoigjsoY')

		expect(res).toEqual(
			`<p><iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" frameborder="0" src="https://www.youtube.com/embed/6RAtoigjsoY" class="youtube aspect-video mx-auto w-full rounded"></iframe></p>\n`
		)
	})

	it('should convert youtu.be url to the embed url', () => {
		const res = markdownToHtml(
			'https://youtu.be/6RAtoigjsoY?si=EfT8TJ_uM3kXwCKF'
		)

		expect(res).toEqual(
			`<p><iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" frameborder="0" src="https://www.youtube.com/embed/6RAtoigjsoY" class="youtube aspect-video mx-auto w-full rounded"></iframe></p>\n`
		)
	})

	it('should convert url to a', () => {
		const res = markdownToHtml('https://www.example.com')

		expect(res).toEqual(
			`<p><a href="https://www.example.com">https://www.example.com</a></p>\n`
		)
	})
})
