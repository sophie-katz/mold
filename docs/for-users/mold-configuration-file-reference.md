<!--
Copyright (c) 2023 Sophie Katz

This file is part of Mold.

Mold is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

Mold is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General
Public License for more details.

You should have received a copy of the GNU General Public License along with Mold. If not, see
<https://www.gnu.org/licenses/>.
-->

# `mold.config.ts` reference

The Mold configuration file can be:

- `mold.config.ts` in the template root directory
- `mold.config.js` in the template root directory (the same as above except without type checking)
- Any file passed in with the `-f` or `--template-file` options

The file should look like this:

```typescript
import { defineConfiguration } from '@sophie-katz/mold';

// `defineConfiguration` is a helper function to make sure that
// your configuration is valid and to provide type hints
export default defineConfiguration({
  // The configuration goes here
  ...
});
```

# Keys

These are the keys to the top-level configuration object which is the sole argument to the `defineConfiguration` function. They are in alphabetical order. Only the keys marked as _(required)_ are such.

## `description`

**Type:** `string`

A short description of the template.

## `exclude`

**Type:** `string[]`, `(string) => boolean | Promise<boolean>`

A list of file globs to exclude from the template in the `source` directory. If both the `include` and `exclude` keys are specified, `exclude` takes precedence.

It can also be a predicate function that takes any given absolute file path as input.

File globs follow the syntax specified in the [node-glob](https://github.com/isaacs/node-glob#glob-primer) library.

## `handlebars`

**Type:** `object`

Options used to configure how Handlebars is used.

### `handlebars.extension`

**Type:** `string`

The file extension used to specify files that should be processed using Handlebars as opposed to as raw text. This extension should _not_ be prefixed with a `.` character.

Handlebars files are then of the form:

```
<base name>.<handlebars extension>
```

## `include`

**Type:** `string[]`, `(string) => boolean | Promise<boolean>`

A list of file globs to include from the template in the `source` directory. Any files missing from this list will be excluded. If both the `include` and `exclude` keys are specified, `exclude` takes precedence.

It can also be a predicate function that takes any given absolute file path as input.

File globs follow the syntax specified in the [node-glob](https://github.com/isaacs/node-glob#glob-primer) library.

## `maxFileContentLength`

**Type:** `number`

The maximum size in bytes of a file in the template. This is to prevent very large files from being included in templates by accident.

See [size constants](#size-constants) below for examples on how to specify sizes in bytes. This number will always be rounded _down_ to the nearest integer.

## `maxFileCount`

**Type:** `number`

The maximum number of files allowed in the template. Directories, even empty ones, count as 1 file. This is to prevent large directory structures (like `node_modules` or `.venv`) from accidentally being included in the template.

This number will always be rounded _down_ to the nearest integer.

## `maxTemplateSize`

**Type:** `number`

The maximum size in bytes of the template as a whole. This is calculated by taking the sum of all file contents. This is to prevent a template from taking up too many resources, since templates are fully loaded into memory.

See [size constants](#size-constants) below for examples on how to specify sizes in bytes. This number will always be rounded _down_ to the nearest integer.

## `moldVersion` (required)

**Type:** `string`

The required version of Mold with which the template is compatible. Versions are specified using [node-semver](https://github.com/npm/node-semver) syntax.

## `name` (required)

**Type:** `string`

The name of the template. It should be written in `kebab-case`.

## `plugins`

**Type:** `PluginBase[]`

See the [plugin object](#plugin-objects) section below for details.

Plugins to be loaded at start time to extend Mold.

## `questions`

**Type:** `Question[]`

See the [question objects](#question-objects) section below for details.

Questions to ask the user when creating a new project in order to configure the template.

## `rules`

**Type:** `RuleBase[]`

See the [rule object](#rule-objects) section below for details.

Rules to be run when checking a project against a template.

## `source` (required)

**Type:** `string`

The path to the directory containing the template files, relative to the `mold.config.ts` file. For most templates, this will simply be `template`.

## `tasks`

**Type:** `Task[]`

See the [task objects](#task-objects) section below for more details.

Tasks to be run at different points in the template lifecycle.

## `templateEncoding`

The encoding used to load template files. This can be any value from the [`BufferEncoding`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/node/buffer.d.ts) type built into Node.JS.

# `PluginBase` objects

`PluginBase` objects are run on load time and can be used to extend Mold. All plugins inherit from the `PluginBase` abstract class.

See the [custom plugins](./custom-plugins.md) guide for more details.

# `Question` objects

These are the keys to the `Question` objects. They are in alphabetical order. Only the keys marked as _(required)_ are such.

Many functions that can be passed as values to this object take a `answersSoFar: object` argument, which is a clone of the answers object populated only with the answers so far.

## `choices`

**Type:** `string[]`, `(answersSoFar?: object) => string[] | Promise<string[]>`

See [above](#question-objects) for details on the `answersSoFar` argument.

These are the possible values that the question can be answered with. They are listed for the user to choose from.

It can either be an array of strings or a function that returns an array of strings. The function is evaluated just before the current question is prompted to the user.

## `default`

**Type:** `AnswerUnionType`, `(answersSoFar?: object) => AnswerUnionType | Promise<AnswerUnionType>`

See [answer types](#answer-types) for details on `AnswerUnionType`. See [above](#question-objects) for details on the `answersSoFar` argument.

The default value to put for the answer. The user can always override this.

It can either be an answer value or a function that returns an answer value. The function is evaluated just before the current question is prompted to the user.

## `help`

**Type:** `string`, `(answersSoFar? object) => string | Promise<string>`

Additional help to display when asking a question. See [above](#question-objects) for details on the `answersSoFar` argument.

It can either be a string or a function that returns a string. The function is evaluated just before the current question is prompted to the user.

## `key` (required)

**Type:** `string`

The key to use when identifying the answer variable in Handlebars. Should be `snake_case`.

## `mapAnswer`

**Type:** `(currentAnswer: CurrentAnswerType, answersSoFar?: object) => AnswerUnionType | Promise<AnswerUnionType>`

See [answer types](#answer-types) for details on `CurrentAnswerType` and `AnswerUnionType`. See [above](#question-objects) for details on the `answersSoFar` argument.

A function that gets applied to the answer to modify it. The new answer is returned. It does not have to be of the same type as long as it is still in the `AnswerUnionType`.

## `placeholder`

**Type:** `string`, `(answersSoFar?: object) => string | Promise<string>`

See [above](#question-objects) for details on the `answersSoFar` argument.

A placeholder value to put for the answer until the user starts typing.

It can either be a string or a function that returns a string. The function is evaluated just before the current question is prompted to the user. The string does not have to pass validation or represent the same type as the answer.

## `prompt` (required)

**Type:** `string`, `(answersSoFar?: object) => string | Promise<string>`

See [above](#question-objects) for details on the `answersSoFar` argument.

The question which is asked. This is usually suffixed with `?`, although that it not required.

It can either be a string or a function that returns a string. The function is evaluated just before the current question is prompted to the user.

## `isSecret`

**Type:** `boolean`

Whether or not to cover up the user's answer on the console.

## `type` (required)

**Type:** `"boolean" | "integer" | "float" | "string"`

The type of the answer.

## `validateAnswer`

**Type:** `(currentAnswer: CurrentAnswerType, answersSoFar?: object) => string | null | Promise<string | null>`

See [answer types](#answer-types) for details on `CurrentAnswerType` and `AnswerUnionType`. See [above](#question-objects) for details on the `answersSoFar` argument.

A function that gets applied to the answer to validate. If `null` is returned, then validation passes. If a string is returned, it is the validation error that will be displayed to the user. The function is evaluated just before the current question is prompted to the user.

## `when`

**Type:** `(answersSoFar?: object) => boolean | Promise<boolean>`

See [above](#question-objects) for details on the `answersSoFar` argument.

A function that returns whether or not to ask the question. If `false` is returned, the answer is either left as `null` or set to its default value if one exists. If `true` is returned, the question is asked normally. The function is evaluated just before the current question is prompted to the user.

# `RuleBase` objects

`RuleBase` objects can be thought of as a particular type of plugin to Mold. They run whenever a project is being checked against a template. All rules inherit from the `RuleBase` abstract class.

See the [custom rules](./custom-rules.md) guide for more details.

# `Task` objects

These are the keys to the `Task` objects. They are in alphabetical order. Only the keys marked as _(required)_ are such.

## `action` (required if `type` is `"function"`)

**Type:** `(answersSoFar? object) => void | Promise<void>`

See [above](#question-objects) for details on the `answersSoFar` argument.

The function to be run when `type` is `"function"`.

## `args` (required if `type` is `"exec"`)

**Type:** `string[]`, `(answersSoFar?: object) => string[] | Promise<string[]>`

See [above](#question-objects) for details on the `answersSoFar` argument.

The arguments passed to the binary when `type` is `"exec"`.

## `command` (required if `type` is `"exec"` or `"shell"`)

**Type:** `string`, `(answersSoFar?: object) => string | Promise<string>`

If `type` is `"exec"` it is the binary to be executed. This can either be an executable name which is searched for in the system path or an absolute path to the executable (not recommended).

If `type` is `"shell"` it is the full text of the command to run on the shell. If the `shell` key is passed, this shell will be used. Otherwise, the default user shell will be used.

## `on` (required)

**Type:** `string`, `string[]`

The lifecycle events when which to run the task. The values can be any of:

- `"create:before"`, `"create:after"` - Run the task before/after a project is created for the first time.
- `"update-project:before"`, `"update-project:after"` - Run the task before/after a project is updated from a template.
- `"check-project:before"`, `"check-project:after"` - Run the task before/after a project is checked against a template.
- `"run:before"`, `"run:after"` - Run the task before/after Mold runs in any mode.

## `shell`

**Type:** `string`, `(answersSoFar? object) => string | Promise<string>`

See [above](#question-objects) for details on the `answersSoFar` argument.

The shell to use for executing shell commands. This can either be an executable name which is searched for in the system path or an absolute path to the executable (not recommended).

## `stderr`

**Type:** `string`

See the [`stdout`](#stdout) key. This key is identical except for dealing with the `stderr` stream.

## `stdout`

**Type:** `string`

The mode to use for `stdout` output. Can be any of:

- `"inherit"` - Take no action to redirect `stdout`.
- `"discard"` - Discard any `stdout` output. Do not output.

## `type` (required)

**Type:** `string`

The type of the task. Can be any one of:

- `"exec"` - Executes a binary with arguments. If this type is used, the `command` and `args` keys are required.
- `"shell"` - Executes a command with the shell. If this type is used, the `command` key is required.
- `"function"` - Calls a function. If this type is used, the `action` key is required.

# Size constants

The library `@sophie-katz/mold`, which is imported by the `mold.config.ts` configuration file, also exports a few constants to help with specifying byte sizes:

- `KB` is defined to be 1024
- `MB` is defined to be `1024 * KB`
- `GB` is defined to be `1024 * MB`

For example:

```typescript
import { defineConfiguration, MB } from "@sophie-katz/mold";

export default defineConfiguration({
    ...
    maxFileContentLength: 5 * MB,
    ...
});
```

# Answer types

`AnswerUnionType` is a union of the `boolean`, `number`, and `string` types. Any answer will be of one of these types.

The type `CurrentAnswerType` is used above to represent the answer type of the current question.
