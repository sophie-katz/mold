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

![GitHub License](https://img.shields.io/github/license/sophie-katz/mold)

<p align="center"><img src="https://raw.githubusercontent.com/sophie-katz/mold/main/docs/assets/mold-high-resolution-logo-transparent.png#gh-light-mode-only" width="400rem" alt="Mold logo" /> <img src="https://raw.githubusercontent.com/sophie-katz/mold/main/docs/assets/mold-high-resolution-logo-white-transparent.png#gh-dark-mode-only" width="400rem" alt="Mold logo" /><br /><br />Mold is a templating tool for projects.
</p>

---

- [Getting started](#getting-started)
  - [Documentation](#documentation)
- [Usage](#usage)
  - [Creating a project](#creating-a-project)
  - [Checking for consistency](#checking-for-consistency)
  - [Updating the project](#updating-the-project)
  - [Updating the template from a project](#updating-the-template-from-a-project)
- [Writing templates](#writing-templates)
  - [Questions](#questions)
  - [Tasks](#tasks)
  - [Rules](#rules)

---

# Getting started

To install Mold, run:

```shell
npm install -g @sophie-katz/mold
```

## Documentation

- [User guide](./docs/for-users/guide.md)
- [Developer documentation](./docs/for-developers/overview.md)

# Usage

> [!WARNING]  
> Mold is still in early development and how it is used is subject to change!

Mold is a tool to create templates for projects and then use those templates to keep code consistent
with those templates.

## Creating a project

For example, let's use this Node.JS template (_this template is yet to be created_). We can create a
project with this command:

```shell
mold create https://github.com/sophie-katz/nodejs-mold.git example-project
```

After answering some questions, this will create a directory `./example-project` which contains the
generated code. There will also be a file `./example-project/.mold.json` which will contain
a cache of generation info so that the next time you update the project it won't re-ask you the same
questions.

## Checking for consistency

After making changes to the project, we can make sure that it's still consistent with the original
template:

```shell
mold check project https://github.com/sophie-katz/nodejs-mold.git example-project
```

If any of the code diverges from the template, it will tell you.

## Updating the project

If there are changes made to the template and you want to apply them to the project, you can use
this command:

```shell
mold update project https://github.com/sophie-katz/nodejs-mold.git example-project
```

## Updating the template from a project

Frequently, development on a project will change the part of the code generated by the template. To
make it easier to share these changes with other projects using the template, you can automatically
update the template:

```shell
# Clone the template
git clone https://github.com/sophie-katz/nodejs-mold.git

# Update the template from a project
mold update template nodejs-mold example-project
```

At this point, you should see changes in the cloned template directory that you can check and then
push.

You can also check the template against the project:

```shell
mold check template nodejs-mold example-project
```

# Writing templates

This is the directory structure of a template:

```
mold.config.ts
template/
    ...
```

`mold.config.ts` is the configuration for the template. This contains options to:

- [Ask questions to the user when creating](#questions)
- [Run tasks to run at different points in the template lifecycle](#tasks)

Let's add a simple file to the template. Create a directory called `./my-nodejs-mold`. Save this as `template/.gitignore` within that directory:

```shell
node_modules/
/dist/
```

And then create a `mold.config.ts` file:

```typescript
import { defineConfiguration } from '@sophie-katz/mold';

// `defineConfiguration` is a helper function to make sure that your configuration is valid and to
// provide type hints
export default defineConfiguration({
  // The name of the template
  name: 'nodejs-mold',

  // You can require certain versions of Mold in your templates
  moldVersion: '^0.1.0',

  // Some options that tell Mold how to load your template
  templateOptions: {
    // The path to the template files, relative to the mold.config.ts file
    sourcePath: 'template',
  },
});
```

You can read more about the structure of the `mold.config.ts` file in the [Mold configuration file reference](./docs/for-users/mold-configuration-file-reference.md) page. When we run this command, it will create an example project using our template:

```shell
mold create ./my-nodejs-mold example-project
```

If you look inside the `example-project` directory, there should be two single files: `.gitignore` and `.mold.json`. If you open `.gitignore` it should match our template:

```shell
node_modules/
/dist/
```

Congratulations! You created a project with a template! Of course, this is a very simplistic
example. Mold has a lot more functionality that makes it useful for real life use cases.

## Questions

A very important part of Mold is the ability to configure templates when creating project. A common
example of this is asking the user what the project should be named. If you add this code to your
`mold.config.ts`, it will do just this:

```typescript
import { defineConfiguration } from '@sophie-katz/mold';

export default defineConfiguration({
  ...
  // Add this code:
  questions: [
    {
        prompt: "What is the name of your project?",
        name: "project_name",
        type: "text"
    }
  ],
  ...
});
```

Now, if we create a new example project...

```shell
# (assuming that 'example-project' does not exist)
$ mold create ./my-nodejs-mold example-project

What is the name of your project?
```

It will prompt the user for an answer. We can modify the template in order to use this answer. Add a
new file `template/package.json.handlebars` to `my-nodejs-mold`:

```json
{
  "name": "{{ project_name }}",
  "version": "0.1.0"
}
```

The `.handlebars` extension tells Mold that it should use the
[Handlebars](https://handlebarsjs.com/) library to render the `package.json` file. Handlebars allows
you to inject variables into text, along with many other features. The code `{{ project_name }}`
will take the user's answer to the `"project_name"` question and inject it into `package.json`.

If we create a new example project...

```shell
# (assuming that 'example-project' does not exist)
$ mold create ./my-nodejs-mold example-project

What is the name of your project? example-project
```

It will create a file `package.json` with these contents:

```json
{
  "name": "example-project",
  "version": "0.1.0"
}
```

You can read more about how to use questions and their answers in the [Question objects](./docs/for-users/mold-configuration-file-reference.md#question-objects) section of the configuration file reference.

## Tasks

Let's say we also want to create a new Git repository in the project directory when creating a new
project. We can add this piece of code to the `mold.config.ts` file:

```typescript
import { defineConfiguration } from '@sophie-katz/mold';

export default defineConfiguration({
  ...
  // Add this code:
  tasks: [
    // We define one task
    {
      // It will run before creating a new project
      before: "creating",
      // And it will run these steps:
      steps: [
        // Execute the command `git init` in the project directory
        {
          type: "shell",
          command: "git init"
        }
      ]
    }
  ],
  ...
});
```

Now after creating a new project, there will be a `.git` directory freshly initialized!

See the [Task objects](./docs/for-users/mold-configuration-file-reference.md#task-objects) part of the configuration file reference for more info.

## Rules

> [!IMPORTANT]  
> This is under active development.
