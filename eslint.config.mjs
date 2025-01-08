/**
 * ESLint configuration for the project.
 *
 * See https://eslint.style and https://typescript-eslint.io for additional linting options.
 */
import eslintConfigs from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
	{
		ignores: [
			'.vscode-test',
			'dist',
			'out',
			'esbuild.js',
			'eslint.config.mjs',
		]
	},
	eslintConfigs.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.stylistic,
	{
		languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
		plugins: {
			'@stylistic': stylistic
		},
		rules: {
			'curly': 'warn',
			'@stylistic/semi': ['warn', 'always'],
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/naming-convention': [
				'warn',
				{
					'selector': 'import',
					'format': ['camelCase', 'PascalCase']
				}
			],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					'argsIgnorePattern': '^_'
				}
			]
		}
	}
);
