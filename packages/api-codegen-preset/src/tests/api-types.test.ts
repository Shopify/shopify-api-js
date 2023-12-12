import fs from "fs";

import { shopifyApiTypes } from "../api-types";
import { ApiType, ShopifyApiProjectOptions } from "../types";

describe("shopifyApiTypes", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe.each([ApiType.Admin, ApiType.Storefront])(
    "when API type is %s",
    (apiType) => {
      const type = apiType.toLowerCase();

      it("loads schema from URL when file isn't present", () => {
        // GIVEN
        const config: ShopifyApiProjectOptions = {
          apiType,
          apiVersion: "2023-10",
          outputDir: "./testDir",
          documents: ["./src/**/*.ts"],
          module: "module",
        };

        // WHEN
        const projectConfig = shopifyApiTypes(config);

        // THEN
        expect(projectConfig).toEqual({
          [`./testDir/${type}-2023-10.schema.json`]: {
            schema: `https://shopify.dev/${type}-graphql-direct-proxy/2023-10`,
            plugins: ["introspection"],
            config: { minify: true },
          },
          [`./testDir/${type}.types.d.ts`]: {
            schema: `https://shopify.dev/${type}-graphql-direct-proxy/2023-10`,
            plugins: ["typescript"],
          },
          [`./testDir/${type}.generated.d.ts`]: {
            schema: `https://shopify.dev/${type}-graphql-direct-proxy/2023-10`,
            documents: config.documents,
            preset: expect.anything(),
            presetConfig: { apiType, module: "module" },
          },
        });
      });

      it("loads schema from file when file is present", () => {
        // GIVEN
        const config: ShopifyApiProjectOptions = {
          apiType,
          apiVersion: "2023-10",
          outputDir: "./testDir",
          documents: ["./src/**/*.ts"],
          module: "module",
        };

        const spy = jest.spyOn(fs, "existsSync");
        spy.mockReturnValueOnce(true);

        // WHEN
        const projectConfig = shopifyApiTypes(config);

        // THEN
        expect(projectConfig).toEqual({
          [`./testDir/${type}.types.d.ts`]: {
            schema: `./testDir/${type}-2023-10.schema.json`,
            plugins: ["typescript"],
          },
          [`./testDir/${type}.generated.d.ts`]: {
            schema: `./testDir/${type}-2023-10.schema.json`,
            documents: config.documents,
            preset: expect.anything(),
            presetConfig: { apiType, module: "module" },
          },
        });
      });

      it("defaults missing configs to URLs when file is not present", () => {
        // GIVEN
        const config: ShopifyApiProjectOptions = { apiType };

        // WHEN
        const projectConfig = shopifyApiTypes(config);

        // THEN
        expect(projectConfig).toEqual({
          [`./${type}.schema.json`]: {
            schema: `https://shopify.dev/${type}-graphql-direct-proxy`,
            plugins: ["introspection"],
            config: { minify: true },
          },
          [`./${type}.types.d.ts`]: {
            schema: `https://shopify.dev/${type}-graphql-direct-proxy`,
            plugins: ["typescript"],
          },
          [`./${type}.generated.d.ts`]: {
            schema: `https://shopify.dev/${type}-graphql-direct-proxy`,
            documents: ["**/*.{ts,tsx}", "!**/node_modules"],
            preset: expect.anything(),
            presetConfig: { apiType, module: undefined },
          },
        });
      });

      it("defaults missing configs to files when file is present", () => {
        // GIVEN
        const config: ShopifyApiProjectOptions = { apiType };

        const spy = jest.spyOn(fs, "existsSync");
        spy.mockReturnValueOnce(true);

        // WHEN
        const projectConfig = shopifyApiTypes(config);

        // THEN
        expect(projectConfig).toEqual({
          [`./${type}.types.d.ts`]: {
            schema: `./${type}.schema.json`,
            plugins: ["typescript"],
          },
          [`./${type}.generated.d.ts`]: {
            schema: `./${type}.schema.json`,
            documents: ["**/*.{ts,tsx}", "!**/node_modules"],
            preset: expect.anything(),
            presetConfig: { apiType, module: undefined },
          },
        });
      });
    },
  );
});
