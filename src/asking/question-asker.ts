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

import { Question } from '../domain/configuration/question';
import { AnswerObjectType } from '../domain/answer';
import { ErrorNotImplemented } from '../common/errors';

/**
 * A class to ask questions to the user to help configure the template.
 */
export class QuestionAsker {
  /**
   * Constructor.
   * @param questions - The full list of questions to ask, in order.
   * @param answersInitial - The initial answers to use for the questions.
   */
  constructor(
    private readonly questions: Question[],
    private readonly answersInitial?: AnswerObjectType,
  ) {}

  /**
   * Ask any questions that haven't already been answered.
   *
   * Iterates through `questions` in order, asking each question that doesn't have an
   * entry in `answersInitial`.
   *
   * @returns The answers to all questions, including those that were already answered.
   */
  public async askAllUnanswered(): Promise<AnswerObjectType> {
    // TODO: This is scaffold code and needs to be implemented!
    throw new ErrorNotImplemented();
  }
}
