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
  FileTree,
  FileTreeDirectory,
  FileTreeDirectoryEntry,
  FileTreeFile,
} from '../domain/file-tree';
import { LoaderBase } from './base';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { join } from 'path';
import {
  LimitTracker,
  LimitTrackerOptions,
  defaultLimitTrackerOptions,
} from './utlities/limit-tracker';
import { ErrorLoaderParseFileContentLength } from '../common/errors';

export interface LoaderFileTreeOptions extends LimitTrackerOptions {
  fileEncoding?: BufferEncoding;
}

export const defaultLoaderFileTreeOptions: LoaderFileTreeOptions = {
  ...defaultLimitTrackerOptions,
  fileEncoding: 'utf-8',
};

/**
 * Base class to load file trees.
 */
export abstract class LoaderFileTreeBase<
  FileValueType,
  DirectoryValueType,
> extends LoaderBase<FileTree<FileValueType, DirectoryValueType>> {
  private options: LoaderFileTreeOptions;
  private limitTracker: LimitTracker;

  constructor(options?: LoaderFileTreeOptions) {
    super();

    this.options = { ...defaultLoaderFileTreeOptions, ...options };
    this.limitTracker = new LimitTracker(this.options);

    if (!this.options.fileEncoding) {
      throw new Error("option 'fileEncoding' must be specified");
    }
  }

  public override async load(
    path: string,
  ): Promise<FileTree<FileValueType, DirectoryValueType>> {
    const stats = await fsPromises.lstat(path);

    if (stats.isSymbolicLink()) {
      throw new Error('symbolic links are not allowed');
    } else if (stats.isFile()) {
      return await this.loadFile(path, stats);
    } else if (stats.isDirectory()) {
      return await this.loadDirectory(path);
    } else {
      throw new Error(
        `unsupported file type: ${path} (not file, directory, or symbolic link)`,
      );
    }
  }

  async loadFile(
    path: string,
    stats: fs.Stats,
  ): Promise<FileTreeFile<FileValueType, DirectoryValueType>> {
    this.trackFileLimits(path, stats);

    const fileHandle = await fsPromises.open(path, 'r');

    try {
      const encoding = this.options.fileEncoding;

      if (!encoding) {
        throw new Error("option 'fileEncoding' must be specified");
      }

      const text = await fileHandle.readFile({
        encoding,
      });

      if (typeof text !== 'string') {
        throw new Error(
          'Expected text to be a string, not a buffer since encoding was specified',
        );
      }

      return new FileTreeFile<FileValueType, DirectoryValueType>(
        await this.loadFileValue(path, text),
      );
    } finally {
      fileHandle.close();
    }
  }

  trackFileLimits(path: string, stats: fs.Stats) {
    if (
      this.options.maxFileContentLength &&
      stats.size > this.options.maxFileContentLength
    ) {
      throw new ErrorLoaderParseFileContentLength(
        path,
        this.options.maxFileContentLength,
        stats.size,
      );
    }

    this.limitTracker.trackFileCount(1);

    this.limitTracker.trackMemoryUsage(stats.size);
  }

  async loadDirectory(
    path: string,
  ): Promise<FileTreeDirectory<FileValueType, DirectoryValueType>> {
    this.limitTracker.trackFileCount(1);

    const promises = [];
    const directoryEntries: FileTreeDirectoryEntry<FileValueType, DirectoryValueType>[] =
      [];

    for await (const name of await fsPromises.readdir(path)) {
      this.limitTracker.trackMemoryUsage(name.length);

      const childPath = join(path, name);

      promises.push(
        this.load(childPath).then((node) => {
          directoryEntries.push(new FileTreeDirectoryEntry(name, node));
        }),
      );
    }

    await Promise.all(promises);

    return new FileTreeDirectory<FileValueType, DirectoryValueType>(
      await this.loadDirectoryValue(path),
      directoryEntries,
    );
  }

  protected abstract loadFileValue(path: string, text: string): Promise<FileValueType>;

  protected abstract loadDirectoryValue(path: string): Promise<DirectoryValueType>;
}
