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

import { join } from 'path';

/**
 * A file tree that consists of files and directories with bound data at every file or
 * directory node.
 *
 * @param FileValueType - The type of value to bind to file nodes.
 * @param DirectoryValueType - The type of value to bind to directory nodes.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class FileTree<FileValueType, DirectoryValueType> {
  /**
   * Accept a visitor.
   *
   * @param visitor - The visitor to accept.
   */
  public abstract accept(
    visitor: FileTreeVisitor<FileValueType, DirectoryValueType>,
    path?: string,
  ): Promise<VisitorResult>;
}

/**
 * A result returned by visitor methods to control the traversal of a file tree.
 */
export enum VisitorResult {
  /**
   * Continue traversal as normal.
   */
  Continue = 'Continue',

  /**
   * If the current node is a directory, do not traverse its children.
   */
  SkipChildren = 'SkipChildren',

  /**
   * Stop traversal immediately.
   */
  Stop = 'Stop',
}

export abstract class FileTreeVisitor<FileValueType, DirectoryValueType> {
  /**
   * Method called when visitor reaches a file.
   *
   * @param path - The relative path in the file tree.
   * @param value - The value bound to the file node.
   * @param node - A reference to the node itself.
   * @returns A {@link VisitorResult} to control traversal.
   */
  public abstract onVisitFile(
    path: string,
    value: FileValueType,
    node?: Readonly<FileTreeFile<FileValueType, DirectoryValueType>>,
  ): Promise<VisitorResult>;

  /**
   * Method called when visitor reaches a directory.
   *
   * This gets called before traversing children.
   *
   * @param path - The relative path in the file tree.
   * @param value - The value bound to the directory node.
   * @param node - A reference to the node itself.
   * @returns A {@link VisitorResult} to control traversal.
   */
  public abstract onVisitDirectory(
    path: string,
    value: DirectoryValueType,
    node?: Readonly<FileTreeDirectory<FileValueType, DirectoryValueType>>,
  ): Promise<VisitorResult>;
}

/**
 * A directory entry which represents the child of a directory node.
 *
 * See {@link FileTree} for more information about type parameters.
 */
export class FileTreeDirectoryEntry<FileValueType, DirectoryValueType> {
  /**
   * Constructor.
   *
   * @param name - The name of the child in the directory.
   * @param value - The node which represents the child.
   */
  constructor(
    public readonly name: string,
    public readonly value: FileTree<FileValueType, DirectoryValueType>,
  ) {}
}

/**
 * A directory node in a file tree.
 *
 * See {@link FileTree} for more information about type parameters.
 */
export class FileTreeDirectory<FileValueType, DirectoryValueType> extends FileTree<
  FileValueType,
  DirectoryValueType
> {
  /**
   * Constructor.
   *
   * @param value - The value bound to the directory.
   * @param children - The child nodes of the directory.
   */
  constructor(
    public value: DirectoryValueType,
    public children: FileTreeDirectoryEntry<FileValueType, DirectoryValueType>[],
  ) {
    super();
  }

  public override async accept(
    visitor: FileTreeVisitor<FileValueType, DirectoryValueType>,
    path?: string,
  ): Promise<VisitorResult> {
    let result = await visitor.onVisitDirectory(path ?? '.', this.value, this);

    if (result === VisitorResult.Stop || result === VisitorResult.SkipChildren) {
      return result;
    }

    for (const child of this.children) {
      result = await child.value.accept(
        visitor,
        path ? join(path, child.name) : child.name,
      );

      if (result === VisitorResult.Stop) {
        return result;
      }
    }

    return VisitorResult.Continue;
  }
}

/**
 * A file node in a file tree.
 *
 * See {@link FileTree} for more information about type parameters.
 */
export class FileTreeFile<FileValueType, DirectoryValueType> extends FileTree<
  FileValueType,
  DirectoryValueType
> {
  /**
   * Constructor.
   *
   * @param value - The value bound to the file.
   */
  constructor(public value: FileValueType) {
    super();
  }

  public override accept(
    visitor: FileTreeVisitor<FileValueType, DirectoryValueType>,
    path?: string,
  ): Promise<VisitorResult> {
    return visitor.onVisitFile(path ?? '.', this.value, this);
  }
}
