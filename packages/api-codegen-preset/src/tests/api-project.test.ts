import fs from "fs";

import { shopifyApiProject } from "../api-project";
import { ApiType, ShopifyApiProjectOptions } from "../types";

describe("shopifyApiProject", () => {
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
        const projectConfig = shopifyApiProject(config);

        // THEN
        expect(projectConfig).toEqual({
          schema: `https://shopify.dev/${type}-graphql-direct-proxy/2023-10`,
          documents: config.documents,
          extensions: {
            // This is tested by the api-types file
            codegen: expect.anything(),
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
        spy.mockReturnValue(true);

        // WHEN
        const projectConfig = shopifyApiProject(config);

        // THEN
        expect(projectConfig).toEqual({
          schema: `./testDir/${type}-2023-10.schema.json`,
          documents: config.documents,
          extensions: {
            // This is tested by the api-types file
            codegen: expect.anything(),
          },
        });
      });

      it("defaults missing values", () => {
        // GIVEN
        const config: ShopifyApiProjectOptions = {
          apiType,
        };

        // WHEN
        const projectConfig = shopifyApiProject(config);

        // THEN
        expect(projectConfig).toEqual({
          schema: `https://shopify.dev/${type}-graphql-direct-proxy`,
          documents: ["**/*.{ts,tsx}", "!node_modules"],
          extensions: {
            // This is tested by the api-types file
            codegen: expect.anything(),
          },
        });
      });
    },
  );
});
