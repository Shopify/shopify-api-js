const { GlobSync } = require("glob");

const packageDir = ["."];
if (process.cwd().includes("shopify-api-js/packages")) {
  packageDir.push(__dirname);
} else {
  const glob = new GlobSync(`${__dirname}/packages/*`);
  glob.found.forEach((path) =>
    packageDir.push(path.replace(/^.*\/shopify-api-js\//, ""))
  );
}

module.exports = {
  env: {
    browser: false,
    es2021: true,
  },
  extends: ["plugin:@shopify/typescript", "plugin:@shopify/prettier"],
  ignorePatterns: ["dist/", "node_modules/"],
  rules: {
    "no-console": 0,
    "@typescript-eslint/naming-convention": 0,
    "import/no-extraneous-dependencies": ["error", { packageDir }],
  },
};
