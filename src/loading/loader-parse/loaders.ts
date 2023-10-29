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
import { LimitTracker } from './limit-tracker';
import { TemplateFileName } from '../../domain/template-file-name';
import { TemplateFile } from '../../domain/template-file';
import { TemplateFileContentRaw, TemplateFileHandlebars } from '../../domain/template-file-content';
import * as path from 'path';
import { TemplateDirectory } from '../../domain/template-directory';
import * as fsPromises from 'fs/promises';
import { ErrorLoaderParseFileContentLength } from './errors';

/**
 * Parses a file name template from a path.
 * @param pathFile - A path in the filesystem - this can be a file or a directory.
 * @returns A `TemplateFileName` instance for the base name of the path.
 * @throws `LoaderParseErrorFileContentLength` if the file content is over the configured limit.
 */
export function loadFileName(pathFile: string, limitTracker: LimitTracker): TemplateFileName {
  // Get the path basename
  const pathBasename = path.basename(pathFile);

  // Track memory usage
  limitTracker.trackMemoryUsage(pathBasename.length);

  // Return results
  return new TemplateFileName(pathBasename);
}

/**
 * Parses a directory into a template. Children may not be in original order due to asynchronicity.
 * @param pathDirectory - The path to the directory.
 * @returns A `TemplateDirectory` instance.
 */
export async function loadDirectory(
  pathDirectory: string,
  options: LoaderParseOptions,
  limitTracker: LimitTracker
): Promise<TemplateDirectory> {
  // Track the directory as 1 file
  limitTracker.trackFileCount(1);

  // Create an empty template directory instance.
  const templateDirectory = new TemplateDirectory(loadFileName(pathDirectory, limitTracker));

  // Create a list of tasks that can run in parallel.
  const tasks = [];

  // Enumerate the directory children.
  for await (const directoryEntry of await fsPromises.readdir(pathDirectory, {
    withFileTypes: true,
  })) {
    const directoryEntryPath = path.join(pathDirectory, directoryEntry.name);

    if (directoryEntry.isDirectory()) {
      // If the child is a directory, load it recursively.
      tasks.push(
        loadDirectory(directoryEntryPath, options, limitTracker).then((child) => {
          templateDirectory.children.push(child);
        })
      );
    } else {
      // If the child is a file, load it.
      tasks.push(
        loadFile(directoryEntryPath, options, limitTracker).then((child) => {
          templateDirectory.children.push(child);
        })
      );
    }
  }

  // Resolve all of the tasks, each of which adds a child to the template directory instance.
  //
  // This doesn't preserve the original order, but that shouldn't be an issue since templates are
  // rendered asynchronously anyway.
  await Promise.all(tasks);

  // Return the now populated template directory.
  return templateDirectory;
}

/**
 * Parses a file into a template.
 * @param pathFile - The path to the file.
 */
export async function loadFile(
  pathFile: string,
  options: LoaderParseOptions,
  limitTracker: LimitTracker
): Promise<TemplateFile> {
  // Validate the Handlebars extension option
  if (!options.handlebarsExtension) {
    throw new Error(`'handlebarsExtension' must be set in options`);
  }

  // Load the file
  if (pathFile.endsWith(options.handlebarsExtension)) {
    // ... as a Handlebars template
    return await loadFileHandlebars(
      pathFile,
      pathFile.slice(0, -options.handlebarsExtension.length),
      options,
      limitTracker
    );
  } else {
    // ... or as a raw file
    return await loadFileRaw(pathFile, options, limitTracker);
  }
}

/**
 * Parses a file as raw text.
 * @param pathFile - The path to the file.
 * @param options - Options to configure the loader.
 * @param limitTracker - Limit tracker to track the file's memory usage.
 */
export async function loadFileRaw(
  pathFile: string,
  options: LoaderParseOptions,
  limitTracker: LimitTracker
): Promise<TemplateFile> {
  return new TemplateFile(
    loadFileName(pathFile, limitTracker),
    new TemplateFileContentRaw(await loadFileHelper(pathFile, options, limitTracker))
  );
}

/**
 * Parses a file as a Handlebars template.
 * @param pathFile - The path to the file.
 * @param pathWithoutHandlebarsExtension - The path to the file without the Handlebars extension.
 * @param options - Options to configure the loader.
 * @param limitTracker - Limit tracker to track the file's memory usage.
 */
export async function loadFileHandlebars(
  pathFile: string,
  pathWithoutHandlebarsExtension: string,
  options: LoaderParseOptions,
  limitTracker: LimitTracker
): Promise<TemplateFile> {
  return new TemplateFile(
    loadFileName(pathWithoutHandlebarsExtension, limitTracker),
    new TemplateFileHandlebars(await loadFileHelper(pathFile, options, limitTracker))
  );
}

/**
 * Helper function to load file contents.
 * @param pathFile - The path to the file.
 * @param options - Options to configure the loader.
 * @param limitTracker - Limit tracker to track the file's memory usage.
 * @returns
 */
async function loadFileHelper(
  pathFile: string,
  options: LoaderParseOptions,
  limitTracker: LimitTracker
): Promise<string> {
  // Open the file
  const fileHandle = Bun.file(pathFile);

  // Check the file content length
  if (options.maxFileContentLength && fileHandle.size > options.maxFileContentLength) {
    throw new ErrorLoaderParseFileContentLength(
      pathFile,
      options.maxFileContentLength,
      fileHandle.size
    );
  }

  // Track the file count
  limitTracker.trackFileCount(1);

  // Track the memory usage
  limitTracker.trackMemoryUsage(fileHandle.size);

  // Load the file content
  return await fileHandle.text();
}
