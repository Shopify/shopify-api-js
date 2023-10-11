import dts from "rollup-plugin-dts";

import { getPlugins, mainSrcInput, bannerConfig } from "./rollup-common.cjs";

const config = [
  {
    input: mainSrcInput,
    plugins: getPlugins({
      minify: true,
    }),
    output: [
      {
        file: "./dist/graphql-client.min.js",
        format: "umd",
        sourcemap: true,
        name: "ShopifyGraphQLClient",
        ...bannerConfig,
      },
    ],
  },
  {
    input: mainSrcInput,
    plugins: getPlugins(),
    output: [
      {
        dir: "./dist",
        format: "es",
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].mjs",
      },
    ],
  },
  {
    input: mainSrcInput,
    plugins: getPlugins(),
    output: [
      {
        dir: "./dist",
        format: "cjs",
        sourcemap: true,
        exports: "named",
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    ],
  },
  {
    input: "./dist/ts/index.d.ts",
    output: [{ file: "dist/graphql-client.d.ts", format: "es" }],
    plugins: [dts.default()],
  },
];

export default config;
