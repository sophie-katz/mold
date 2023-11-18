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
