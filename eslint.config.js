const js = require('@eslint/js');
const globals = require('globals');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
  eslintConfigPrettier,
];
