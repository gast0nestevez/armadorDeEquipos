import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['dist/'],
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, 'simple-import-sort': simpleImportSort },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
  {
    rules: {
      eqeqeq: 'error',
      curly: 'error',
      semi: 'error',
      quotes: ['error', 'single'],
      '@typescript-eslint/no-require-imports': 'off',
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
  eslintConfigPrettier,
]);
