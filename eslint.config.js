// Copyright (c) 2023 Sophie Katz
//
// This file is part of Mold.
//
// Mold is free software: you can redistribute it and/or modify it under the terms of the
// GNU General Public License as published by the Free Software Foundation, either version
// 3 of the License, or (at your option) any later version.
//
// Mold is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
// without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
// PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Mold. If
// not, see <https://www.gnu.org/licenses/>.

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
