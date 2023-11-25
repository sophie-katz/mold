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

import { defineConfiguration } from '../../dist/index';

export default defineConfiguration({
  name: 'simple',
  templateVersion: '0.1.0',
  moldVersion: '0.1.0',
  templateOptions: {
    sourcePath: 'template',
  },
  questions: [
    {
      key: 'packageName',
      prompt: 'What is the name of the package?',
      validateAnswer: (answer) =>
        /^(@[a-zA-Z]([a-zA-Z0-9-]*[a-zA-Z0-9])?\/)?[a-zA-Z]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(
          answer,
        ),
    },
    {
      key: 'packageVersion',
      prompt: 'What is the version of the package?',
      default: '0.1.0',
      validateAnswer: (answer) => /^\d+\.\d+\.\d+$/.test(answer),
    },
  ],
});
