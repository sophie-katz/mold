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

/**
 * Mode for file content to indicate how it should be rendered.
 */
export enum FileContentMode {
  /**
   * Raw text that should be copied as-is.
   */
  Raw = 'Raw',

  /**
   * Templated text that should be rendered with Handlebars.
   */
  Handlebars = 'Handlebars',
}

/**
 * Represents the content of a file in the template.
 */
export class FileContent {
  /**
   * Constructor.
   *
   * @param content - The text content of the file.
   * @param mode - The mode of the file content.
   */
  public constructor(
    public readonly content: string,
    public readonly mode: FileContentMode,
  ) {}
}
