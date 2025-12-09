import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/dist/**',
      '**/.eslintrc.cjs',
      '**/node_modules/**',
      '**/sdks/membershipclient/api.ts',
      '**/.cache/**',
      '**/.turbo/**',
      '**/.earthly/**',
      '**/.github/**',
      '**/.helm/**',
      '**/build/**',
      '**/public/build/**',
      '**/.dockerignore',
      '**/docker-compose.yml',
      '**/Earthfile',
      '**/otel-config.yml',
      '**/.env',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
        JSX: 'readonly',
        VoidFunction: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'import/first': 'off',
      'react-refresh/only-export-components': 'off',
      'no-console': 'warn',
      'newline-before-return': 'error',
      'linebreak-style': 'off',
      'arrow-body-style': 'error',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'jsx-a11y/anchor-has-content': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': ['error', { allowReferrer: true }],
    },
  },
];
