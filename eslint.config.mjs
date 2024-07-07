import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  js.configs.recommended,

  ...tseslint.configs.recommended.map(conf => ({
    ...conf,
    files: ['**/*.ts'],
  })),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: 'error',
    },
  },

  {
    ignores: ['node_modules/', '.git/', '.github/', 'dist/',],
  },

  {
    files: [
      'jest.config.js',
      'postcss.config.js',
      'webpack.config.js',
    ],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        __dirname: 'readonly',
      }
    }
  },
  {
    files: [
      'src/subprojects/websites/FullscreenSliderMaterialize/scripts/script.js',
      'src/subprojects/websites/RandomColorGenerator/scripts/script.js',
    ],
    languageOptions: {
      globals: {
        M: 'readonly',
        chroma: 'readonly',
      }
    }
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

  {
    files: ['**/*.ts'],
    rules: {
    },
  },
];
