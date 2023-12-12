import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";

import * as pkg from "./package.json";

export const mainSrcInput = "src/index.ts";

export function getPlugins({ tsconfig, minify } = {}) {
  return [
    replace({
      preventAssignment: true,
      ROLLUP_REPLACE_CLIENT_VERSION: pkg.version,
    }),
    resolve(),
    commonjs(),
    typescript({
      tsconfig: tsconfig ? tsconfig : "./tsconfig.json",
      outDir: "./dist/ts",
    }),
    ...(minify === true ? [terser({ keep_fnames: new RegExp("fetch") })] : []),
  ];
}

const packageName = pkg.name.substring(1);
export const bannerConfig = {
  banner: `/*! ${packageName}@${pkg.version} -- Copyright (c) 2023-present, Shopify Inc. -- license (MIT): https://github.com/Shopify/shopify-api-js/blob/main/LICENSE.md */`,
};

const config = [
  {
    input: mainSrcInput,
    plugins: getPlugins({
      minify: true,
      tsconfig: "./tsconfig.umd.json",
    }),
    output: [
      {
        file: "./dist/umd/storefront-api-client.min.js",
        format: "umd",
        sourcemap: true,
        name: "ShopifyStorefrontAPIClient",
        ...bannerConfig,
      },
    ],
  },
  {
    input: mainSrcInput,
    plugins: getPlugins({
      tsconfig: "./tsconfig.umd.json",
    }),
    output: [
      {
        file: "./dist/umd/storefront-api-client.js",
        format: "umd",
        sourcemap: true,
        name: "ShopifyStorefrontAPIClient",
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
    output: [{ file: "dist/storefront-api-client.d.ts", format: "es" }],
    plugins: [dts.default()],
  },
];

export default config;
