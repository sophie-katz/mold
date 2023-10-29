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

import { describe, expect, test } from 'bun:test';
import { loadFileName, loadFileRaw, loadFileHandlebars, loadFile, loadDirectory } from './loaders';
import { LimitTracker } from './limit-tracker';
import { TemplateFile } from '../../domain/template-file';
import * as os from 'os';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

describe('Load file name', () => {
  test('Simple', () => {
    const limitTracker = new LimitTracker({});
    expect(loadFileName('test', limitTracker).render({})).toEqual('test');
  });

  test('Handlebars', () => {
    const limitTracker = new LimitTracker({});
    expect(loadFileName('{{ x }}, {{ y }}', limitTracker).render({ x: '1', y: '2' })).toEqual(
      '1, 2'
    );
  });

  test('Track memory exact', () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 5 });
    loadFileName('aaaaa', limitTracker);
  });

  test('Track memory over', () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 5 });
    expect(() => loadFileName('aaaaaa', limitTracker)).toThrow(
      'maximum memory usage limit exceeded: 5 bytes (0.000 MB)'
    );
  });
});

describe('Load file raw', () => {
  test('Simple', async () => {
    const limitTracker = new LimitTracker({});
    const templateFile = await loadFileRaw('examples/simple/raw_file.txt', {}, limitTracker);
    expect(templateFile.pathRelative.render({})).toEqual('raw_file.txt');
    expect(templateFile.content.render({})).toEqual('hello, world');
  });

  test('With Handlebars path', async () => {
    const limitTracker = new LimitTracker({});
    const templateFile = await loadFileRaw('examples/simple/{{ raw_name }}.txt', {}, limitTracker);
    expect(templateFile.pathRelative.render({ raw_name: 'handlebars_raw_file' })).toEqual(
      'handlebars_raw_file.txt'
    );
    expect(templateFile.content.render({})).toEqual('hello, world');
  });

  test('File content limit exact', async () => {
    const limitTracker = new LimitTracker({});
    await loadFileRaw('examples/simple/raw_file.txt', { maxFileContentLength: 12 }, limitTracker);
  });

  test('File content limit over', async () => {
    const limitTracker = new LimitTracker({});
    expect(
      async () =>
        await loadFileRaw(
          'examples/simple/raw_file.txt',
          { maxFileContentLength: 11 },
          limitTracker
        )
    ).toThrow(
      "max file content length limit exceeded for file: 'examples/simple/raw_file.txt' (max length: 11, actual length: 12)"
    );
  });

  test('Memory usage limit exact', async () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 24 });
    await loadFileRaw('examples/simple/raw_file.txt', {}, limitTracker);
  });

  test('Memory usage limit over', async () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 23 });
    expect(async () => await loadFileRaw('examples/simple/raw_file.txt', {}, limitTracker)).toThrow(
      'maximum memory usage limit exceeded: 23 bytes (0.000 MB)'
    );
  });

  test('File count limit exact', async () => {
    const limitTracker = new LimitTracker({ maxFileCount: 2 });
    await loadFileRaw('examples/simple/raw_file.txt', {}, limitTracker);
    await loadFileRaw('examples/simple/raw_file.txt', {}, limitTracker);
  });

  test('File count limit over', async () => {
    const limitTracker = new LimitTracker({ maxFileCount: 1 });
    await loadFileRaw('examples/simple/raw_file.txt', {}, limitTracker);
    expect(async () => await loadFileRaw('examples/simple/raw_file.txt', {}, limitTracker)).toThrow(
      'maximum file count limit exceeded: 1 file and/or directory'
    );
  });
});

describe('Load file Handlebars', () => {
  test('Simple', async () => {
    const limitTracker = new LimitTracker({});
    const templateFile = await loadFileHandlebars(
      'examples/simple/handlebars_file.txt.handlebars',
      'examples/simple/handlebars_file.txt',
      {},
      limitTracker
    );
    expect(templateFile.pathRelative.render({})).toEqual('handlebars_file.txt');
    expect(templateFile.content.render({ x: '1', y: '2' })).toEqual('1, 2');
  });

  test('With Handlebars path', async () => {
    const limitTracker = new LimitTracker({});
    const templateFile = await loadFileHandlebars(
      'examples/simple/{{ handlebars_name }}.txt.handlebars',
      'examples/simple/{{ handlebars_name }}.txt',
      {},
      limitTracker
    );
    expect(
      templateFile.pathRelative.render({ handlebars_name: 'handlebars_handlebars_file' })
    ).toEqual('handlebars_handlebars_file.txt');
    expect(templateFile.content.render({ x: '1', y: '2' })).toEqual('1, 2');
  });

  test('File content limit exact', async () => {
    const limitTracker = new LimitTracker({});
    await loadFileHandlebars(
      'examples/simple/handlebars_file.txt.handlebars',
      'examples/simple/handlebars_file.txt',
      { maxFileContentLength: 16 },
      limitTracker
    );
  });

  test('File content limit over', async () => {
    const limitTracker = new LimitTracker({});
    expect(
      async () =>
        await loadFileHandlebars(
          'examples/simple/handlebars_file.txt.handlebars',
          'examples/simple/handlebars_file.txt',
          { maxFileContentLength: 15 },
          limitTracker
        )
    ).toThrow(
      "max file content length limit exceeded for file: 'examples/simple/handlebars_file.txt.handlebars' (max length: 15, actual length: 16)"
    );
  });

  test('Memory usage limit exact', async () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 35 });
    await loadFileHandlebars(
      'examples/simple/handlebars_file.txt.handlebars',
      'examples/simple/handlebars_file.txt',
      {},
      limitTracker
    );
  });

  test('Memory usage limit over', async () => {
    const limitTracker = new LimitTracker({ maxMemoryUsage: 34 });
    expect(
      async () =>
        await loadFileHandlebars(
          'examples/simple/handlebars_file.txt.handlebars',
          'examples/simple/handlebars_file.txt',
          {},
          limitTracker
        )
    ).toThrow('maximum memory usage limit exceeded: 34 bytes (0.000 MB)');
  });

  test('File count limit exact', async () => {
    const limitTracker = new LimitTracker({ maxFileCount: 2 });
    await loadFileHandlebars(
      'examples/simple/handlebars_file.txt.handlebars',
      'examples/simple/handlebars_file.txt',
      {},
      limitTracker
    );
    await loadFileHandlebars(
      'examples/simple/handlebars_file.txt.handlebars',
      'examples/simple/handlebars_file.txt',
      {},
      limitTracker
    );
  });

  test('File count limit over', async () => {
    const limitTracker = new LimitTracker({ maxFileCount: 1 });
    await loadFileHandlebars(
      'examples/simple/handlebars_file.txt.handlebars',
      'examples/simple/handlebars_file.txt',
      {},
      limitTracker
    );
    expect(
      async () =>
        await loadFileHandlebars(
          'examples/simple/handlebars_file.txt.handlebars',
          'examples/simple/handlebars_file.txt',
          {},
          limitTracker
        )
    ).toThrow('maximum file count limit exceeded: 1 file and/or directory');
  });
});

describe('Load file', () => {
  test('No extension set', () => {
    expect(
      async () => await loadFile('examples/simple/raw_file.txt', {}, new LimitTracker({}))
    ).toThrow("'handlebarsExtension' must be set in options");
  });

  test('Raw file', async () => {
    const templateFile = await loadFile(
      'examples/simple/raw_file.txt',
      { handlebarsExtension: '.handlebars' },
      new LimitTracker({})
    );

    expect(templateFile.pathRelative.render({})).toEqual('raw_file.txt');
    expect(templateFile.content.render({})).toEqual('hello, world');
  });

  test('Handlebars file', async () => {
    const templateFile = await loadFile(
      'examples/simple/handlebars_file.txt.handlebars',
      { handlebarsExtension: '.handlebars' },
      new LimitTracker({})
    );

    expect(templateFile.pathRelative.render({})).toEqual('handlebars_file.txt');
    expect(templateFile.content.render({ x: '1', y: '2' })).toEqual('1, 2');
  });
});

describe('Load directory', () => {
  test('Simple', async () => {
    const templateDirectory = await loadDirectory(
      'examples/simple',
      { handlebarsExtension: '.handlebars' },
      new LimitTracker({})
    );

    expect(templateDirectory.pathRelative.render({})).toEqual('simple');
    expect(templateDirectory.children.length).toEqual(4);
    expect(
      templateDirectory.children.findIndex(
        (child) =>
          child.pathRelative.render({}) == 'raw_file.txt' &&
          child instanceof TemplateFile &&
          child.content.render({}) == 'hello, world'
      )
    ).toBeGreaterThanOrEqual(0);
    expect(
      templateDirectory.children.findIndex(
        (child) =>
          child.pathRelative.render({}) == 'handlebars_file.txt' &&
          child instanceof TemplateFile &&
          child.content.render({ x: '1', y: '2' }) == '1, 2'
      )
    ).toBeGreaterThanOrEqual(0);
    expect(
      templateDirectory.children.findIndex(
        (child) =>
          child.pathRelative.render({ raw_name: 'handlebars_raw_file' }) ==
            'handlebars_raw_file.txt' &&
          child instanceof TemplateFile &&
          child.content.render({}) == 'hello, world'
      )
    ).toBeGreaterThanOrEqual(0);
    expect(
      templateDirectory.children.findIndex(
        (child) =>
          child.pathRelative.render({ handlebars_name: 'handlebars_handlebars_file' }) ==
            'handlebars_handlebars_file.txt' &&
          child instanceof TemplateFile &&
          child.content.render({ x: '1', y: '2' }) == '1, 2'
      )
    ).toBeGreaterThanOrEqual(0);
  });

  test('Empty', async () => {
    const pathDirectory = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'mold-template-empty-'));

    try {
      const templateDirectory = await loadDirectory(
        pathDirectory,
        { handlebarsExtension: '.handlebars' },
        new LimitTracker({})
      );

      expect(templateDirectory.children.length).toEqual(0);
    } finally {
      await fsPromises.rm(pathDirectory, { recursive: true });
    }
  });

  test('File count limit exact', async () => {
    const pathDirectory = await fsPromises.mkdtemp(
      path.join(os.tmpdir(), 'mold-template-one-file-')
    );

    try {
      await Bun.write(path.join(pathDirectory, 'file.txt'), 'hello, world');

      const limitTracker = new LimitTracker({ maxFileCount: 2 });

      await loadDirectory(pathDirectory, { handlebarsExtension: '.handlebars' }, limitTracker);
    } finally {
      await fsPromises.rm(pathDirectory, { recursive: true });
    }
  });

  test('File count limit over', async () => {
    const pathDirectory = await fsPromises.mkdtemp(
      path.join(os.tmpdir(), 'mold-template-one-file-')
    );

    try {
      await Bun.write(path.join(pathDirectory, 'file.txt'), 'hello, world');

      const limitTracker = new LimitTracker({ maxFileCount: 1 });

      expect(
        async () =>
          await loadDirectory(pathDirectory, { handlebarsExtension: '.handlebars' }, limitTracker)
      ).toThrow('maximum file count limit exceeded: 1 file and/or directory');
    } finally {
      await fsPromises.rm(pathDirectory, { recursive: true });
    }
  });
});
