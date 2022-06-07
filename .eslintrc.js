module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ['plugin:@shopify/typescript', 'plugin:@shopify/prettier'],
  ignorePatterns: ['dist/', 'src/rest-resources'],
  rules: {
    'import/no-named-as-default': 0,
    'no-mixed-operators': 0,
    'no-console': 0,
    'lines-around-comment': 0,
    'import/no-cycle': 0,
  },
  overrides: [
    {
      files: [
        'src/__tests__/*.ts',
        'src/base-rest-resource.ts',
        'src/rest-resources/*',
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
