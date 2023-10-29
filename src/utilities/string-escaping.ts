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

/**
 * Add escapes to strings.
 */
export function escapeString(value: string): string {
  return [...value]
    .map((char) => {
      if (char.length != 1) {
        throw new Error('error while escaping string - character length is not 1');
      }

      if (char === '\\' || char === '"' || char === "'") {
        return `\\${char}`;
      } else if (char == '\0') {
        return '\\0';
      } else if (char == '\b') {
        return '\\b';
      } else if (char == '\f') {
        return '\\f';
      } else if (char == '\n') {
        return '\\n';
      } else if (char == '\r') {
        return '\\r';
      } else if (char == '\t') {
        return '\\t';
      } else if (char == '\v') {
        return '\\v';
      } else if (char == '?') {
        return '\\?';
      } else {
        const code = char.charCodeAt(0);

        if (code == 0x07) {
          return '\\a';
        } else if (code < 32 || code > 126) {
          return `\\x${code.toString(16).padStart(2, '0')}`;
        } else {
          return char;
        }
      }
    })
    .join('');
}
