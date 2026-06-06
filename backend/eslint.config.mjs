import { defineConfig } from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['eslint.config.mjs', 'prettier.config.mjs', 'dist/**'],
  },
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,mts,cts}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      eqeqeq: 'error',
      curly: ['error', 'all'],
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unnecessary-type-conversion': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-useless-default-assignment': 'error',
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/typedef': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // 1. Third party types
            ['^(?!\\.)[^/]+.*\\u0000$'],
            // 2. Third party functions
            ['^(?!\\.)'],
            // 3. Local types (@/...)
            ['^.*\\u0000$'],
            // 4. Local functions (@/...)
            ['^/'],
            // 5. CSS
            ['\\.(css)$'],
          ],
        },
      ],
    },
  },
]);
