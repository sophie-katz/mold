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
 * A comparer that compares two values and returns a diff.
 */
export abstract class ComparerBase<ValueType, DiffType> {
  /**
   * Compares two values and returns a diff.
   * @param lhs - The left-hand side value.
   * @param rhs - The right-hand side value.
   * @returns A diff between `lhs` and `rhs`.
   */
  public abstract compare(lhs: ValueType, rhs: ValueType): Promise<DiffType>;
}
