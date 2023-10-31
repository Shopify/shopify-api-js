import type { ApiType } from "../types";

interface ApiConfig {
  schema: string;
  schemaFile: string;
  typesFile: string;
  queryTypesFile: string;
  interfaceExtension: string;
  module: string;
  presetConfigs: {
    importTypesFrom: string;
    namespacedImportName: string;
  };
}

type ApiConfigs = {
  [key in ApiType]: ApiConfig;
};

export const apiConfigs: ApiConfigs = {
  Admin: {
    schema: "https://shopify.dev/admin-graphql-direct-proxy%%API_VERSION%%",
    schemaFile: "admin%%API_VERSION%%.schema.json",
    typesFile: "admin.types.d.ts",
    queryTypesFile: "admin.generated.d.ts",
    interfaceExtension: `declare module '%%MODULE%%' {\n  type InputMaybe<T> = AdminTypes.InputMaybe<T>;\n  interface AdminQueries extends %%QUERY%% {}\n  interface AdminMutations extends %%MUTATION%% {}\n}`,
    module: "@shopify/admin-api-client",
    presetConfigs: {
      importTypesFrom: "./admin.types.d.ts",
      namespacedImportName: "AdminTypes",
    },
  },
  Storefront: {
    schema:
      "https://shopify.dev/storefront-graphql-direct-proxy%%API_VERSION%%",
    schemaFile: "storefront%%API_VERSION%%.schema.json",
    typesFile: "storefront.types.d.ts",
    queryTypesFile: "storefront.generated.d.ts",
    interfaceExtension: `declare module '%%MODULE%%' {\n  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;\n  interface StorefrontQueries extends %%QUERY%% {}\n  interface StorefrontMutations extends %%MUTATION%% {}\n}`,
    module: "@shopify/storefront-api-client",
    presetConfigs: {
      importTypesFrom: "./storefront.types.d.ts",
      namespacedImportName: "StorefrontTypes",
    },
  },
};
