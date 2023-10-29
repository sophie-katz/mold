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

import { describe, expect, test } from 'bun:test';
import { TemplateFileContentRaw, TemplateFileHandlebars } from './template-file-content';

describe('Rendering', () => {
  describe('Raw', () => {
    test('Empty', () => {
      expect(new TemplateFileContentRaw('').render({})).toEqual('');
    });

    test('Non-empty', () => {
      expect(new TemplateFileContentRaw('hello, world').render({})).toEqual('hello, world');
    });
  });

  describe('Handlebars', () => {
    test('Empty', () => {
      expect(new TemplateFileHandlebars('').render({})).toEqual('');
    });

    test('No templating', () => {
      expect(new TemplateFileHandlebars('hello, world').render({})).toEqual('hello, world');
    });

    test('With variables', () => {
      expect(
        new TemplateFileHandlebars('{{ x }}, {{ y }}').render({
          x: 'hello',
          y: 'world',
        })
      ).toEqual('hello, world');
    });
  });
});
