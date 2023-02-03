module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ['plugin:@shopify/typescript', 'plugin:@shopify/prettier'],
  ignorePatterns: ['dist/'],
  rules: {
    'no-console': 0,
    '@typescript-eslint/naming-convention': 0,
  },
};
