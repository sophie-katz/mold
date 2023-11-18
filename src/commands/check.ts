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

import { program, Command } from '@commander-js/extra-typings';
import { resolveConfigFile } from '../configuring/config-file-resolver';

/**
 * Register the command with the global `program`.
 */
export function registerCheck() {
  configure(program.command('check'));
}

function configure(command: Command) {
  command
    .description('Checks a project against a template')
    .option('-f, --template-file <template file>', 'The path to the template configuration file')
    .action(async (options) => {
      const templateFile = await resolveConfigFile(options.templateFile);

      console.log(templateFile);
    });
}
