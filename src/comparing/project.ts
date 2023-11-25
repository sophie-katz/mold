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
import { ProjectDiff } from '../domain/project/diff';
import { Project } from '../domain/project/project';
import { ComparerBase } from './base';

/**
 * A comparer that compares two values and returns a diff.
 */
export class ComparerProject extends ComparerBase<Project, ProjectDiff> {
  /**
   * Compares two values and returns a diff.
   * @param lhs - The left-hand side value.
   * @param rhs - The right-hand side value.
   * @returns A diff between `lhs` and `rhs`.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override async compare(lhs: Project, rhs: Project): Promise<ProjectDiff> {
    // TODO: This is scaffold code and needs to be implemented!
    throw new ErrorNotImplemented();
  }
}
