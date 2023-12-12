import type { ApiType } from "../types";

import { apiConfigs } from "./api-configs";

export function getSchemaData(
  outputDir: string,
  apiType: ApiType,
  apiVersion?: string,
) {
  const config = apiConfigs[apiType];

  return {
    schema: config.schema.replace(
      "%%API_VERSION%%",
      apiVersion ? `/${apiVersion}` : "",
    ),
    schemaFile: `${outputDir}/${config.schemaFile.replace(
      "%%API_VERSION%%",
      apiVersion ? `-${apiVersion}` : "",
    )}`,
  };
}
