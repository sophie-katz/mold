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

import { Loader } from '../loader';
import { LoaderParseOptions, defaultOptions } from './options';
import { TemplateDirectory } from '../../domain/template-directory';
import { LimitTracker } from './limit-tracker';
import { loadDirectory } from './loaders';

/**
 * Loader that parses a template from a directory.
 */
export class LoaderParse implements Loader {
  /**
   * Options to configure the loader.
   */
  private readonly options: LoaderParseOptions;

  /**
   * Constructor.
   * @param options Options to configure the loader.
   */
  constructor(
    private readonly configFileDirectory: string,
    options: LoaderParseOptions,
  ) {
    this.options = {
      ...defaultOptions,
      ...options,
    };
  }

  public async load(): Promise<TemplateDirectory> {
    const limitTracker = new LimitTracker(this.options);

    return await loadDirectory(
      this.options.sourcePath ?? this.configFileDirectory,
      this.options,
      limitTracker,
    );
  }
}
