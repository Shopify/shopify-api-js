module.exports = {
  extends: "../../.eslintrc.cjs",
  overrides: [
    {
      files: ["**/*.cjs"],
      env: {
        node: true,
      },
    },
    {
      files: ["**/*.test.ts"],
      rules: {
        "@typescript-eslint/ban-ts-comment": 0,
      },
    },
  ],
};
