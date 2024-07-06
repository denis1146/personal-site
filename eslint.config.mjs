import js from '@eslint/js';
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'error',
    },
  },
  {
    ignores: ['node_modules/', '.git/', '.github/', 'dist/',],
  },
  {
    files: ['**/*.{js,mjs}'],
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': 'error',
      'no-unused-expressions': 'error',
    },
  },
];
