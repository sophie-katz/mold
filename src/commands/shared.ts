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

import { Argument, Option } from '@commander-js/extra-typings';

export const ARGUMENT_TEMPLATE = new Argument(
  '<template>',
  'The Mold template directory or URL.',
);

export const ARGUMENT_PROJECT_DIRECTORY = new Argument(
  '<project directory>',
  'The project directory.',
);

export const OPTION_CONFIG_FILE = new Option(
  '-f, --config-file <config file>',
  'The path to the configuration file',
);
