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

import { escapeString } from '../../utilities/string-escaping';

/**
 * An error that occurs when a file in a template is over the configured size limit.
 */
export class ErrorLoaderParseFileContentLength extends Error {
  /**
   * Constructor.
   * @param path The path to the file.
   * @param maxLength The maximum allowed length.
   * @param actualLength The actual length of the file.
   */
  constructor(
    public readonly path: string,
    public readonly maxLength: number,
    public readonly actualLength: number
  ) {
    super(
      `max file content length limit exceeded for file: '${escapeString(
        path
      )}' (max length: ${maxLength}, actual length: ${actualLength})`
    );
    this.name = 'LoaderParseErrorFileContentLength';
  }
}

/**
 * An error that occurs when the number of files in a template is over the configured limit.
 */
export class ErrorLoaderParseFileCount extends Error {
  /**
   * Constructor.
   * @param maxCount The maximum allowed number of files.
   */
  constructor(public readonly maxCount: number) {
    super(
      `maximum file count limit exceeded: ${maxCount} ${
        maxCount == 1 ? 'file and/or directory' : 'files and/or directories'
      }`
    );
    this.name = 'LoaderParseErrorFileCount';
  }
}

/**
 * An error that occurs when the memory usage of a template is over the configured limit. See
 * `LoaderParseOptions.maxMemoryUsage` for details.
 */
export class ErrorLoaderParseMemoryUsage extends Error {
  /**
   * Constructor.
   * @param maxMemoryUsage The maximum allowed memory usage.
   */
  constructor(public readonly maxMemoryUsage: number) {
    super(
      `maximum memory usage limit exceeded: ${maxMemoryUsage} byte${
        maxMemoryUsage == 1 ? '' : 's'
      } (${(maxMemoryUsage / (1024 * 1024)).toFixed(3)} MB)`
    );
    this.name = 'LoaderParseErrorMemoryUsage';
  }
}
