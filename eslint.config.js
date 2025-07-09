module.exports = [
    {
      files: ['**/*.js'],
      languageOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        globals: {
          window: false,
          document: false,
          console: false,
          module: false,
          require: false,
          process: false,
          __dirname: false,
        },
      },
      plugins: {},
      rules: {
        'no-unused-vars': 'warn',
        'no-console': 'off',
      },
    },
  ];