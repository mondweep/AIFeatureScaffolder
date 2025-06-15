module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
  ],
  rules: {
    // React
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/prop-types': 'off', // Using TypeScript for prop validation
    
    // TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // General
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
  ],
};