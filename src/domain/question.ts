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
 * Options that can be used to configure a question.
 */
export interface QuestionOptions {
  /**
   * The prompt to display to the user.
   */
  prompt: string | (() => string);

  /**
   * A set of choices to limit the answer to.
   */
  choices?: string[] | (() => string[]);

  /**
   * The default string answer.
   */
  default?: string | (() => string);

  /**
   * A function that modifies the answer.
   */
  mapAnswer?: (answer: string) => string;

  /**
   * A function that validates the original string answer.
   */
  validateAnswer?: (answer: string) => boolean;
}

/**
 * Represents a question to ask as part of template configuration.
 */
export class Question {
  constructor(public readonly options: QuestionOptions) {}
}
