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

import {
  ErrorLoaderParseFileCount,
  ErrorLoaderParseMemoryUsage,
} from '../../common/errors';

/**
 * Options to configure the limit tracker.
 */
export interface LimitTrackerOptions {
  /**
   * The maximum length of a file's content that is allowed to be loaded, in bytes.
   */
  maxFileContentLength?: number;

  /**
   * The maximum number of files that are allowed to be loaded. Directories count as 1 file in this
   * count.
   */
  maxFileCount?: number;

  /**
   * The maximum memory footprint of the loaded template, in bytes.
   *
   * This is calculated approximately by summing the sizes of:
   * - The file names of all files and directories in the template.
   * - The file sizes of all files in the template.
   */
  maxMemoryUsage?: number;
}

export const defaultLimitTrackerOptions: LimitTrackerOptions = {
  maxFileCount: 1000,
  maxMemoryUsage: 1024 * 1024 * 128, // 128 MB
};

enum Limit {
  FileCount = 'file count',
  MemoryUsage = 'memory usage',
}

/**
 * A helper class to track usage limits while loading templates.
 */
export class LimitTracker {
  private readonly options: LimitTrackerOptions;

  /**
   * The remaining count allowed for different limits.
   */
  private allowed: { [key in Limit]?: number } = {};

  /**
   * Constructor.
   *
   * @param options - The options to configure the tracker.
   */
  constructor(options?: LimitTrackerOptions) {
    this.options = { ...defaultLimitTrackerOptions, ...options };
    this.addAllowed(Limit.FileCount, this.options.maxFileCount);
    this.addAllowed(Limit.MemoryUsage, this.options.maxMemoryUsage);
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
   * @param fileCount - The number of files to be tracked.
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
   * @param memoryUsage - The number of bytes to be tracked.
   * @throws An `Error` if the number of bytes to be tracked is not positive.
   * @throws An `ErrorLoaderParseMemoryUsage` if the memory usage exceeds the configured limit.
   */
  public trackMemoryUsage(memoryUsage: number) {
    if (
      this.options.maxMemoryUsage != null &&
      this.track(Limit.MemoryUsage, memoryUsage)
    ) {
      throw new ErrorLoaderParseMemoryUsage(this.options.maxMemoryUsage);
    }
  }

  /**
   * Helper method to track a limit.
   * @param limit - The limit to be tracked.
   * @param count - The count to be tracked.
   * @returns `true` if the limit was exceeded, `false` otherwise.
   */
  track(limit: Limit, count: number): boolean {
    if (count <= 0) {
      throw new Error(`count for ${limit} must be positive, not ${count}`);
    }

    let allowedForLimit = this.allowed[limit];

    if (allowedForLimit != null) {
      allowedForLimit -= count;

      if (allowedForLimit < 0) {
        return true;
      }

      this.allowed[limit] = allowedForLimit;
    }

    return false;
  }
}
