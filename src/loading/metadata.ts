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

import { ErrorNotImplemented } from '../common/errors';
import { Metadata } from '../domain/metadata/metadata';
import { LoaderBase } from './base';

/**
 * Load Mold metadata.
 */
export class LoaderMetadata extends LoaderBase<Metadata> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override onLoad(path: string): Promise<Metadata> {
    // TODO: This is scaffold code and needs to be implemented!
    throw new ErrorNotImplemented();
  }
}
