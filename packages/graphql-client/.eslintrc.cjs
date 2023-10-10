module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "jest": true,
  },
  "extends": [
    "plugin:@shopify/typescript",
    "plugin:@shopify/esnext",
    "plugin:@shopify/prettier"
  ],
  "overrides": [
    {
      "files": ["*.ts"],
      "parserOptions": {
        "project": ["./tsconfig.json"],
        "tsconfigRootDir": __dirname
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/consistent-indexed-object-style": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "sort-class-members/sort-class-members": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      }
    ]
  }
}
