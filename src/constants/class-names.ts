export const ProseTextInherit = [
	'text-inherit',
	'prose',
	'prose-headings:text-inherit',
	'prose-p:text-inherit',
	'prose-a:text-inherit',
	'prose-blockquote:text-inherit',
	'prose-strong:text-inherit',
	'prose-li:text-inherit',
	'prose-th:text-inherit',
	'prose-td:text-inherit',
	'prose-li:list-[inherit]',
]

export const ProseTextInheritString = ProseTextInherit.reduce(
	(c, p) => `${c} ${p}`
)
