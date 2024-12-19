import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import functional from 'eslint-plugin-functional'
import globals from 'globals'

export default tseslint.config(
	{
		files: ['**/*.{ts,tsx,mts}'],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			functional.configs.recommended,
			prettier,
		],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
			},
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			'functional/prefer-immutable-types': 'warn',
			'no-unused-vars': 'off',
			'@typescript-eslint/triple-slash-reference': 'warn',
		},
	},
	{
		files: ['**/*.test.ts', '**/*.{js,mjs,cjs}'],
		extends: [functional.configs.off],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
	{
		ignores: [
			'dist',
			'ui',
			'example',
			'.yarn',
			'.preview/.astro',
			'*.{ts,mjs,js}',
		],
	}
)
