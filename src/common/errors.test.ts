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

import { describe, test, expect } from 'vitest';
import {
  ErrorLoaderParseFileContentLength,
  ErrorLoaderParseFileCount,
  ErrorLoaderParseMemoryUsage,
} from './errors';

describe('File content length', () => {
  test('Path with single quotes', () => {
    const error = new ErrorLoaderParseFileContentLength("path'with'single'quotes", 1, 2);
    expect(error.message).toBe(
      "max file content length limit exceeded for file: 'path\\'with\\'single\\'quotes' (max length: 1, actual length: 2)",
    );
  });
});

describe('File count', () => {
  test('1 file', () => {
    const error = new ErrorLoaderParseFileCount(1);
    expect(error.message).toBe(
      'maximum file count limit exceeded: 1 file and/or directory',
    );
  });

  test('2 files', () => {
    const error = new ErrorLoaderParseFileCount(2);
    expect(error.message).toBe(
      'maximum file count limit exceeded: 2 files and/or directories',
    );
  });
});

describe('Memory usage', () => {
  test('1 byte', () => {
    const error = new ErrorLoaderParseMemoryUsage(1);
    expect(error.message).toBe('maximum memory usage limit exceeded: 1 byte (0.000 MB)');
  });

  test('2 bytes', () => {
    const error = new ErrorLoaderParseMemoryUsage(2);
    expect(error.message).toBe('maximum memory usage limit exceeded: 2 bytes (0.000 MB)');
  });

  test('1 KB', () => {
    const error = new ErrorLoaderParseMemoryUsage(1024);
    expect(error.message).toBe(
      'maximum memory usage limit exceeded: 1024 bytes (0.001 MB)',
    );
  });

  test('1023 KB', () => {
    const error = new ErrorLoaderParseMemoryUsage(1024 * 1023);
    expect(error.message).toBe(
      'maximum memory usage limit exceeded: 1047552 bytes (0.999 MB)',
    );
  });

  test('1 MB', () => {
    const error = new ErrorLoaderParseMemoryUsage(1024 * 1024);
    expect(error.message).toBe(
      'maximum memory usage limit exceeded: 1048576 bytes (1.000 MB)',
    );
  });

  test('128 MB', () => {
    const error = new ErrorLoaderParseMemoryUsage(1024 * 1024 * 128);
    expect(error.message).toBe(
      'maximum memory usage limit exceeded: 134217728 bytes (128.000 MB)',
    );
  });
});
