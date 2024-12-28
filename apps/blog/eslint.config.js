import pluginJs from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import astroParser from 'astro-eslint-parser';
import eslintPluginAstro from 'eslint-plugin-astro';
import astroPlugin from 'eslint-plugin-astro';
import noRelativeImportPathsPlugin from 'eslint-plugin-no-relative-import-paths';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import pluginTs from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,tsx,astro}'] },
  { ignores: ['.astro/**/*', 'dist/**/*', '**/static/', './src/env.d.ts'] },
  {
    files: ['**/*.astro'], // .astro 파일만 대상으로 설정
    languageOptions: {
      parser: eslintPluginAstro.parser // Astro 전용 파서 사용
    }
  },
  pluginJs.configs.recommended,
  ...pluginTs.configs.recommended,
  ...eslintPluginAstro.configs['all'],
  {
    rules: {
      'astro/no-set-html-directive': 'off',
      'no-undef': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true }]
    }
  },
  {
    plugins: {
      'no-relative-import-paths': noRelativeImportPathsPlugin
    },
    rules: {
      'no-relative-import-paths/no-relative-import-paths': [
        'warn',
        { allowSameFolder: true, rootDir: 'src', prefix: '@' }
      ]
    }
  },
  // @see https://github.com/lydell/eslint-plugin-simple-import-sort
  {
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  },
  // @see https://github.com/sweepline/eslint-plugin-unused-imports
  {
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_'
        }
      ]
    }
  },
  {
    files: ['**/*.astro'],
    plugins: {
      astro: astroPlugin
    },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
        sourceType: 'module'
      }
    }
  }
];
