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

/**
 * Options to configure `LoaderParse`.
 */
export interface LoaderParseOptions {
  /**
   * The path to the template directory.
   */
  sourcePath?: string;

  /**
   * Included file patterns.
   */
  include?: string[];

  /**
   * Excluded file patterns.
   */
  exclude?: string[];

  /**
   * The extension for Handlebars templated files.
   */
  handlebarsExtension?: string;

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
   * * The file names of all files and directories in the template.
   * * The file sizes of all files in the template.
   */
  maxMemoryUsage?: number;
}

export const defaultOptions: LoaderParseOptions = {
  handlebarsExtension: '.handlebars',
  maxFileCount: 1000,
  maxMemoryUsage: 1024 * 1024 * 128, // 128 MB
};
