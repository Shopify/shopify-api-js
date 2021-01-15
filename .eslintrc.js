module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  plugins: ['@shopify'],
  extends: ['plugin:@shopify/typescript'],
  ignorePatterns: ['dist/'],
  rules: {
    'import/no-named-as-default': 0,
    'no-mixed-operators': 0,
    'no-console': 0,
  },
};
