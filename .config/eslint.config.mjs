import grafanaConfig from '@grafana/eslint-config/flat.js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  ...grafanaConfig,
  {
    rules: {
      'react/prop-types': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],

    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      '@typescript-eslint/no-deprecated': 'warn',
    },
  },
  {
    files: ['./tests/**/*'],

    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
]);
