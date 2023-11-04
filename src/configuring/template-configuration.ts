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

import { QuestionOptions } from '../domain/question';
import { LoaderParseOptions } from '../loading/loader-parse/options';

/**
 * Configuration for a template.
 *
 * **NOTE:** All tasks are run one at a time.
 */
export interface TemplateConfiguration {
  name: string;

  description?: string;

  version: string;

  moldVersion: string;

  /**
   * The list of questions to ask the user to configure the template.
   */
  questions?: QuestionOptions[];

  /**
   * The path to the template directory.
   *
   * If left unset, this defaults to same directory where the template configuration file is.
   */
  sourcePath?: string;

  include?: string[];

  exclude?: string[];

  /**
   * The path where the template gets compiled to.
   */
  destinationPath?: string;

  /**
   * Options for loading the template.
   */
  loadingOptions?: LoaderParseOptions;

  /**
   * Tasks that run before the template is configured. This only happens when the template is
   * first initialized.
   */
  preConfigureTasks?: (() => Promise<void> | void)[];

  /**
   * Tasks that are run before rendering a template. These will run both when initializing a
   * template for the first time and when updating an existing template.
   */
  preRenderTasks?: ((variables: { [key: string]: string }) => Promise<void> | void)[];

  /**
   * Tasks that are run after rendering a template. These will run both when initializing a
   * template for the first time and when updating an existing template.
   */
  postRenderTasks?: ((variables: { [key: string]: string }) => Promise<void> | void)[];

  /**
   * Tasks that run after the template is configured when initializing for the first time, but
   * before it is rendered.
   */
  preInitializeTasks?: ((variables: { [key: string]: string }) => Promise<void> | void)[];

  /**
   * Tasks that run after the template is rendered when initializing for the first time.
   */
  postInitializeTasks?: ((variables: { [key: string]: string }) => Promise<void> | void)[];

  /**
   * Tasks that are run before rendering when updating an existing template.
   */
  preUpdateTasks?: ((variables: { [key: string]: string }) => Promise<void> | void)[];

  /**
   * Tasks that are run after rendering when updating an existing template.
   */
  postUpdateTasks?: ((variables: { [key: string]: string }) => Promise<void> | void)[];
}

export function defineConfiguration(configuration: TemplateConfiguration) {
  return configuration;
}
