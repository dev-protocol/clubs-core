export const ProseTextInheritClassNames = [
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

export const ProseTextInherit = ProseTextInheritClassNames.reduce(
	(c, p) => `${c} ${p}`
)
