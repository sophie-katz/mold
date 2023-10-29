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

import { TemplateVariables } from './template-variables';
import * as Handlebars from 'handlebars';

/**
 * An interface for renderable file contents.
 */
export interface TemplateFileContent {
  /**
   * Renders file contents to a string.
   * @param variables - Variables and their values to pass in when rendering templates.
   */
  render(variables: TemplateVariables): string;
}

/**
 * Represents a template file with raw string content.
 */
export class TemplateFileContentRaw implements TemplateFileContent {
  /**
   * Constructor.
   * @param content - The string content of the template file.
   */
  constructor(private readonly content: string) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public render(variables: TemplateVariables): string {
    return this.content;
  }
}

/**
 * Represents a template file with content rendered by Handlebars.
 */
export class TemplateFileHandlebars implements TemplateFileContent {
  /**
   * Constructor.
   * @param template - A Handlebars template.
   */
  constructor(private readonly template: string) {}

  public render(variables: TemplateVariables): string {
    return Handlebars.compile(this.template)(variables);
  }
}
