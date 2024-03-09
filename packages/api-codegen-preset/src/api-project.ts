import fs from "fs";

import { pluckConfig } from "@shopify/graphql-codegen";

import type { ShopifyApiProjectOptions } from "./types";
import { shopifyApiTypes } from "./api-types";
import { getSchemaData } from "./helpers/get-schema-data";

export const shopifyApiProject = ({
  apiType,
  apiVersion,
  outputDir = ".",
  documents = ["**/*.{ts,tsx}", "!node_modules"],
  module,
}: ShopifyApiProjectOptions) => {
  const { schema, schemaFile } = getSchemaData(outputDir, apiType, apiVersion);

  const schemaFileExists = fs.existsSync(`${schemaFile}`);

  return {
    schema: schemaFileExists ? schemaFile : schema,
    documents,
    extensions: {
      codegen: {
        pluckConfig,
        generates: shopifyApiTypes({
          apiType,
          apiVersion,
          outputDir,
          documents,
          module,
        }),
      },
    },
  };
};
