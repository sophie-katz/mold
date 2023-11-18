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

import { test, expect } from 'vitest';
import { Loader } from './loading/loader';
import { LoaderParse } from './loading/loader-parse/loader-parse';
import { bundleTemplateJSON } from './bundling';
import * as os from 'os';
import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { LoaderBundle } from './loading/loader-bundle';

test('Simple', async () => {
  const loader: Loader = new LoaderParse('examples/testing', {});

  const templateDirectory = await loader.load();

  const pathBundleDirectory = await fsPromises.mkdtemp(
    path.join(os.tmpdir(), 'mold-bundle-simple-'),
  );

  try {
    await bundleTemplateJSON(templateDirectory, path.join(pathBundleDirectory, 'simple'));

    expect(
      (await fsPromises.stat(path.join(pathBundleDirectory, 'simple'))).isDirectory(),
    ).toBeTruthy();
    expect(
      (await fsPromises.stat(path.join(pathBundleDirectory, 'simple/template.json'))).isFile(),
    ).toBeTruthy();

    const loader: Loader = new LoaderBundle(path.join(pathBundleDirectory, 'simple'));

    const templateDirectoryLoaded = await loader.load();

    expect(templateDirectoryLoaded).toEqual(templateDirectory);
  } finally {
    await fsPromises.rm(pathBundleDirectory, { recursive: true });
  }
});
