// Copyright (c) 2023 Sophie Katz
//
// This file is part of Mold.
//
// Mold is free software: you can redistribute it and/or modify it under the terms of the GNU
// General Public License as published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// Mold is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
// Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Mold. If not, see
// <https://www.gnu.org/licenses/>.

import { expect, test } from 'bun:test';
import { escapeString } from './string-escaping';

test('Empty', () => {
  expect(escapeString('')).toEqual('');
});

test('No special chars', () => {
  expect(escapeString('hello, world')).toEqual('hello, world');
});

test('All special chars', () => {
  expect(escapeString('\x00\x01\x07\b\f\n\r\t\v\\\x1f ~\x7f')).toEqual(
    '\\0\\x01\\a\\b\\f\\n\\r\\t\\v\\\\\\x1f ~\\x7f'
  );
});

test('Quotes and slashes', () => {
  expect(escapeString('\'"\\')).toEqual('\\\'\\"\\\\');
});

test('Unicode', () => {
  expect(escapeString('\x80\xff')).toEqual('\\x80\\xff');
});

test('Unescaped escape letters', () => {
  expect(escapeString('abfnrtv')).toEqual('abfnrtv');
});
