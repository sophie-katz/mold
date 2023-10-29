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

/**
 * Abstract class representing a template file.
 */
export class TemplateFileName {
  /**
   * Constructor.
   * @param template - A compiled handlebars template. Use `Handlebars.compile(...)` to compile
   *                   the template before passing it in.
   */
  constructor(private readonly template: any) {}

  /**
   * Renders the templated file name.
   * @param variables - Variables and their values to pass in when rendering templates.
   * @returns A rendered string file name.
   */
  public render(variables: TemplateVariables): string {
    return this.template(variables);
  }
}
