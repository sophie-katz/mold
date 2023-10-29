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

import { LoaderParseOptions } from './options';
import { ErrorLoaderParseFileCount, ErrorLoaderParseMemoryUsage } from './errors';

export enum Limit {
  FileCount = 'file count',
  MemoryUsage = 'memory usage',
}

/**
 * A helper class to track usage limits while loading templates.
 */
export class LimitTracker {
  /**
   * The remaining count allowed for different limits.
   */
  private allowed: { [key in Limit]?: number } = {};

  /**
   * Constructor.
   * @param options The options to configure the tracker.
   */
  constructor(private readonly options: LoaderParseOptions) {
    this.addAllowed(Limit.FileCount, options.maxFileCount);
    this.addAllowed(Limit.MemoryUsage, options.maxMemoryUsage);
  }

  /**
   * Helper method to add a limit.
   * @param limit - The limit to be added.
   * @param count - The count to be added.
   */
  addAllowed(limit: Limit, count: number | undefined) {
    if (count != null && count <= 0) {
      throw new Error(`limit for ${limit} must be positive, not ${count}`);
    }

    this.allowed[limit] = count;
  }

  /**
   * Adds a number of files to be tracked.
   * @param fileCount The number of files to be tracked.
   * @throws An `Error` if the number of files to track is not positive.
   * @throws An `ErrorLoaderParseFileCount` if the number of files to track exceeds the configured
   *         limit.
   */
  public trackFileCount(fileCount: number) {
    if (this.options.maxFileCount != null && this.track(Limit.FileCount, fileCount)) {
      throw new ErrorLoaderParseFileCount(this.options.maxFileCount);
    }
  }

  /**
   * Adds a number of bytes to be tracked.
   * @param memoryUsage The number of bytes to be tracked.
   * @throws An `Error` if the number of bytes to be tracked is not positive.
   * @throws An `ErrorLoaderParseMemoryUsage` if the memory usage exceeds the configured limit.
   */
  public trackMemoryUsage(memoryUsage: number) {
    if (this.options.maxMemoryUsage != null && this.track(Limit.MemoryUsage, memoryUsage)) {
      throw new ErrorLoaderParseMemoryUsage(this.options.maxMemoryUsage);
    }
  }

  /**
   * Helper method to track a limit.
   * @param limit - The limit to be tracked.
   * @param count - The count to be tracked.
   * @param error - A callback to be run on error.
   * @returns `true` if the limit was exceeded, `false` otherwise.
   */
  track(limit: Limit, count: number): boolean {
    if (count <= 0) {
      throw new Error(`count for ${limit} must be positive, not ${count}`);
    }

    if (this.allowed[limit] != null) {
      this.allowed[limit]! -= count;

      if (this.allowed[limit]! < 0) {
        return true;
      }
    }

    return false;
  }
}
