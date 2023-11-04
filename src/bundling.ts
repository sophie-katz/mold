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

import { TemplateDirectory } from './domain/template-directory';
import * as path from 'path';
import * as fsPromises from 'fs/promises';

/**
 * The encoding to use for bundling.
 */
export const encoding: BufferEncoding = 'utf-8';

/**
 * Compiles a template into a bundle.
 *
 * Will create a file within `pathDestination` called `template.json` which contains the bundle
 * itself.
 *
 * Creates the `pathDestination` directory if it does not exist.
 * @param template The template to compile.
 * @param pathDestination The destination directory for the bundle.
 */
export async function bundleTemplateJSON(
  template: TemplateDirectory,
  pathDestination: string,
): Promise<void> {
  await fsPromises.mkdir(pathDestination, { recursive: true });
  await fsPromises.writeFile(
    path.join(pathDestination, 'template.json'),
    JSON.stringify(template),
    { encoding },
  );
}
