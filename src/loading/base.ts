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
 * Base class for loaders.
 *
 * @param ValueType - The type of value that is loaded.
 */
export abstract class LoaderBase<ValueType> {
  private hasLoaded: boolean = false;

  /**
   * Load a value from the given path.
   * @param path - The path from which to load.
   * @returns The loaded value.
   */
  public load(path: string): Promise<ValueType> {
    if (this.hasLoaded) {
      throw new Error('loader has already loaded - loaders are single-use');
    }

    this.hasLoaded = true;

    return this.onLoad(path);
  }

  protected abstract onLoad(path: string): Promise<ValueType>;
}
