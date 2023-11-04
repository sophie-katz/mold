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

import { describe, test, expect } from 'vitest';
import { LimitTracker } from './limit-tracker';

test('No limits', () => {
  new LimitTracker({});
});

describe('File count', () => {
  test('Limit is zero', () => {
    expect(() => new LimitTracker({ maxFileCount: 0 })).toThrow(
      'limit for file count must be positive, not 0',
    );
  });

  test('Limit is negative', () => {
    expect(() => new LimitTracker({ maxFileCount: -1 })).toThrow(
      'limit for file count must be positive, not -1',
    );
  });

  test('Track zero', () => {
    const limitTracker = new LimitTracker({ maxFileCount: 1 });
    expect(() => limitTracker.trackFileCount(0)).toThrow(
      'count for file count must be positive, not 0',
    );
  });

  test('Track negative', () => {
    const limitTracker = new LimitTracker({ maxFileCount: 1 });
    expect(() => limitTracker.trackFileCount(-1)).toThrow(
      'count for file count must be positive, not -1',
    );
  });

  test('Track exactly limit', () => {
    const limitTracker = new LimitTracker({ maxFileCount: 1 });
    limitTracker.trackFileCount(1);
  });

  test('Track less than limit', () => {
    const limitTracker = new LimitTracker({ maxFileCount: 2 });
    limitTracker.trackFileCount(1);
  });

  test('Track more than limit', () => {
    const limitTracker = new LimitTracker({ maxFileCount: 1 });
    expect(() => limitTracker.trackFileCount(2)).toThrow(
      'maximum file count limit exceeded: 1 file and/or directory',
    );
  });

  test('Track multiple exactly limit', () => {
    const limitTracker = new LimitTracker({ maxFileCount: 2 });
    limitTracker.trackFileCount(1);
    limitTracker.trackFileCount(1);
  });

  test('Track multiple more than limit', () => {
    const limitTracker = new LimitTracker({ maxFileCount: 2 });
    limitTracker.trackFileCount(1);
    limitTracker.trackFileCount(1);
    expect(() => limitTracker.trackFileCount(1)).toThrow(
      'maximum file count limit exceeded: 2 files and/or directories',
    );
  });
});

describe('Memory usage', () => {
  test('Limit is zero', () => {
    expect(() => new LimitTracker({ maxMemoryUsage: 0 })).toThrow(
      'limit for memory usage must be positive, not 0',
    );
  });

  test('Limit is negative', () => {
    expect(() => new LimitTracker({ maxMemoryUsage: -1 })).toThrow(
      'limit for memory usage must be positive, not -1',
    );
  });

  test('Track zero', () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 1 });
    expect(() => limitTracker.trackMemoryUsage(0)).toThrow(
      'count for memory usage must be positive, not 0',
    );
  });

  test('Track negative', () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 1 });
    expect(() => limitTracker.trackMemoryUsage(-1)).toThrow(
      'count for memory usage must be positive, not -1',
    );
  });

  test('Track exactly limit', () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 1 });
    limitTracker.trackMemoryUsage(1);
  });

  test('Track less than limit', () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 2 });
    limitTracker.trackMemoryUsage(1);
  });

  test('Track more than limit', () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 1 });
    expect(() => limitTracker.trackMemoryUsage(2)).toThrow(
      'maximum memory usage limit exceeded: 1 byte (0.000 MB)',
    );
  });

  test('Track multiple exactly limit', () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 2 });
    limitTracker.trackMemoryUsage(1);
    limitTracker.trackMemoryUsage(1);
  });

  test('Track multiple more than limit', () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 2 });
    limitTracker.trackMemoryUsage(1);
    limitTracker.trackMemoryUsage(1);
    expect(() => limitTracker.trackMemoryUsage(1)).toThrow(
      'maximum memory usage limit exceeded: 2 bytes (0.000 MB)',
    );
  });
});
