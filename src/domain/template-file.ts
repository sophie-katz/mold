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

import { TemplateFileContent } from './template-file-content';
import { TemplateFileName } from './template-file-name';

/**
 * Represents a directory in a template.
 */
export class TemplateFile {
  /**
   * Constructor.
   * @param pathRelative The relative path to the file in the project.
   * @param content The file contents to be rendered.
   */
  constructor(
    public readonly pathRelative: TemplateFileName,
    public readonly content: TemplateFileContent,
  ) {}
}
