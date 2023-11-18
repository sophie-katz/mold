const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

// const tsOverrideConfig = tsPlugin.configs['eslint-recommended'].overrides[0];
// const tsRecommemdedConfig = tsPlugin.configs.recommended;
// const files = ["**/*.ts", "**/*.tsx"];

const files = ['./src/**/*.ts'];
const ignores = ['.yarn/**'];

module.exports = [
  // 'eslint:recommended',
  {
    files,
    ignores,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          modules: true,
        },
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      // ts,
    },
  },
  // plugins: ['@typescript-eslint'],
  // rules: {
  // ...ts.configs['eslint-recommended'].rules,
  // ...ts.configs['recommended'].rules,
  { files, ignores, rules: ts.configs['eslint-recommended'].overrides[0].rules },
  { files, ignores, rules: ts.configs.recommended.rules },
  // },
];
