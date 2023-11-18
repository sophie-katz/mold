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

import { program } from 'commander';
export { defineConfiguration } from './configuring/template-configuration';

program
  .name('mold')
  .description('A templating tool for projects.')
  .option('-f, --template-file <string>', 'The path to the template file.', './mold.config.ts');

program.parse();

const options = program.opts();

console.log(options.templateFile);
