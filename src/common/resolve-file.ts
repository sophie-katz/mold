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

import * as path from 'path';
import * as fsPromises from 'fs/promises';

/**
 * Checks if the given path should be returned as a configuration file.
 *
 * @param path - The path to check.
 * @returns `true` if the path is a valid configuration file that can be returned, `false`
 *          otherwise.
 */
async function isValidFile(path: string): Promise<boolean> {
  const result = await fsPromises.lstat(path);

  return result.isFile();
}

/**
 * Finds the relative path of the configuration file to use.
 *
 * This has the same signature as `resolveConfigFile`, so see that function for details on
 * usage.
 *
 * @param paths - The paths to check.
 * @param override - An optional user-specified path to the configuration file.
 * @returns The path to the configuration file, or `null` if none was found.
 */
async function resolveFileRelative(
  paths: string[],
  override: string | undefined,
): Promise<string | null> {
  if (override) {
    if (await isValidFile(override)) {
      return override;
    } else {
      return null;
    }
  } else {
    for (const path of paths) {
      if (await isValidFile(path)) {
        return path;
      }
    }

    return null;
  }
}

/**
 * Find the configuration file to use.
 *
 * The file paths from `CONFIG_FILE_PATHS` are checked in order, and the first one that exists is
 * returned. If `override` is provided, it will always be used and `CONFIG_FILE_PATHS` will not be
 * checked.
 *
 * @param paths - The paths to check.
 * @param override - An optional user-specified path to the configuration file.
 * @returns The path to the configuration file, or `null` if none was found.
 */
export async function resolveFile(
  paths: string[],
  override: string | undefined,
): Promise<string | null> {
  const relative = await resolveFileRelative(paths, override);

  if (relative === null) {
    return null;
  }

  return path.resolve(relative);
}
