import fs from "fs";

import { apiConfigs } from "./helpers/api-configs";
import { preset } from "./preset";
import { getSchemaData } from "./helpers/get-schema-data";
import type { ShopifyApiTypesOptions } from "./types";

export const shopifyApiTypes = ({
  apiType,
  apiVersion,
  outputDir = ".",
  documents = ["**/*.{ts,tsx}", "!**/node_modules"],
  module,
}: ShopifyApiTypesOptions) => {
  const config = apiConfigs[apiType];

  const { schema, schemaFile } = getSchemaData(outputDir, apiType, apiVersion);

  const schemaFileExists = fs.existsSync(`${schemaFile}`);

  return {
    ...(schemaFileExists
      ? {}
      : {
          [schemaFile]: {
            schema,
            plugins: ["introspection"],
            config: { minify: true },
          },
        }),
    [`${outputDir}/${config.typesFile}`]: {
      schema: schemaFileExists ? schemaFile : schema,
      plugins: ["typescript"],
    },
    [`${outputDir}/${config.queryTypesFile}`]: {
      schema: schemaFileExists ? schemaFile : schema,
      preset,
      documents,
      presetConfig: { apiType, module },
    },
  };
};
