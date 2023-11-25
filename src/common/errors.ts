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
 * An error to throw when reaching code that hasn't been implemented yet.
 *
 * @example
 *
 * function scaffoldCode() {
 *   // TODO: This is scaffold code and needs to be implemented!
 *   throw new ErrorNotImplemented();
 * }
 */
export class ErrorNotImplemented extends Error {
  constructor() {
    super('Not implemented');
    this.name = 'NotImplementedError';
  }
}
