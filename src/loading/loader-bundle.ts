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

import { TemplateDirectory } from '../domain/template-directory';
import * as path from 'path';
import { Loader } from './loader';

/**
 * Loader that loads a compiled bundle.
 */
export class LoaderBundle implements Loader {
  /**
   * Constructor.
   * @param pathTemplate The path to the template bundle directory.
   */
  constructor(public readonly pathTemplate: string) {}

  public async load(): Promise<TemplateDirectory> {
    return JSON.parse(await Bun.file(path.join(this.pathTemplate, 'template.json')).text());
  }
}
