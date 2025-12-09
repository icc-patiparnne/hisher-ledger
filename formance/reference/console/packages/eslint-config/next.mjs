import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'node_modules',
      '.cache',
      '.turbo',
      '.earthly',
      '.github',
      '.helm',
      'public/build',
      '.dockerignore',
      'docker-compose.yml',
      'Earthfile',
      'otel-config.yml',
      '.env',
    ],
  },
  {
    rules: {
      // Apply consistent rules from base.js
      'no-console': 'warn',
      'newline-before-return': 'error',
      'arrow-body-style': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': ['error', { allowReferrer: true }],
    },
  },
];

export default eslintConfig;
