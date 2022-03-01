module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  plugins: ['@shopify', 'prettier'],
  extends: ['plugin:@shopify/typescript', 'prettier'],
  ignorePatterns: ['dist/'],
  rules: {
    'import/no-named-as-default': 0,
    'no-mixed-operators': 0,
    'no-console': 0,
  },
  overrides: [
    {
      files: [
        'src/clients/rest/test/*.ts',
        'src/clients/rest/base.ts',
        'src/clients/rest/admin*/*.ts',
      ],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            // Allow snake_case so we can have properties that follow the API's naming conventions
            format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
          },
        ],
      },
    },
  ],
};
