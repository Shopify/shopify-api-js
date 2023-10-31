import type { ApiType } from "../types";

interface ApiConfig {
  schema: string;
  schemaFile: string;
  typesFile: string;
  queryTypesFile: string;
}

type ApiConfigs = {
  [key in ApiType]: ApiConfig;
};

export const apiConfigs: ApiConfigs = {
  Admin: {
    schema: "https://shopify.dev/admin-graphql-direct-proxy%%API_VERSION%%",
    schemaFile: "admin%%API_VERSION%%.schema.json",
    typesFile: "admin.types.ts",
    queryTypesFile: "admin.generated.d.ts",
  },
  Storefront: {
    schema:
      "https://shopify.dev/storefront-graphql-direct-proxy%%API_VERSION%%",
    schemaFile: "storefront%%API_VERSION%%.schema.json",
    typesFile: "storefront.types.ts",
    queryTypesFile: "storefront.generated.d.ts",
  },
};
