module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ['plugin:@shopify/typescript', 'plugin:@shopify/prettier'],
  ignorePatterns: ['dist/'],
  workingDirectories: ['packages/*'],
  rules: {
    'no-console': 0,
    '@typescript-eslint/naming-convention': 0,
    'import/no-extraneous-dependencies': [2, { packageDir: ['.', '../..'] }]
  },
};
