module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ['plugin:@shopify/typescript', 'plugin:@shopify/prettier'],
  ignorePatterns: ['dist/'],
  rules: {
    'import/no-named-as-default': 0,
    'no-mixed-operators': 0,
    'no-console': 0,
  },
  overrides: [
    {
      files: [
        'src/rest_resources/__tests__/*.ts',
        'src/rest_resources/base.ts',
        'src/rest_resources/admin*/*.ts',
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
