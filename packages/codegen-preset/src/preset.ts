import type { Types } from "@graphql-codegen/plugin-helpers";
import { preset as hydrogenPreset } from "@shopify/hydrogen-codegen";

import { ApiType, type ShopifyApiPresetConfig } from "./types";

interface ApiPresetConfig {
  importTypesFrom: string;
  namespacedImportName: string;
  interfaceExtension: string;
  module: string;
}

type ApiPresetConfigs = {
  [key in ApiType]: ApiPresetConfig;
};

const apiPresetConfigs: ApiPresetConfigs = {
  Admin: {
    importTypesFrom: "./admin.types",
    namespacedImportName: "AdminTypes",
    interfaceExtension: `declare module '%%MODULE%%' {\n  type InputMaybe<T> = AdminTypes.InputMaybe<T>;\n  interface AdminQueries extends %%QUERY%% {}\n  interface AdminMutations extends %%MUTATION%% {}\n}`,
    module: "@shopify/admin-client",
  },
  Storefront: {
    importTypesFrom: "./storefront.types",
    namespacedImportName: "StorefrontTypes",
    interfaceExtension: `declare module '%%MODULE%%' {\n  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;\n  interface StorefrontQueries extends %%QUERY%% {}\n  interface StorefrontMutations extends %%MUTATION%% {}\n}`,
    module: "@shopify/storefront-client",
  },
};

export const preset: Types.OutputPreset<ShopifyApiPresetConfig> = {
  buildGeneratesSection: (options) => {
    const apiType = options.presetConfig.apiType;

    const { interfaceExtension, module, ...customPresetConfigs } =
      apiPresetConfigs[apiType];

    return hydrogenPreset.buildGeneratesSection({
      ...options,
      presetConfig: {
        ...customPresetConfigs,
        interfaceExtension: ({
          queryType,
          mutationType,
        }: {
          queryType: string;
          mutationType: string;
        }) =>
          interfaceExtension
            .replace("%%MODULE%%", options.presetConfig.module ?? module)
            .replace("%%QUERY%%", queryType)
            .replace("%%MUTATION%%", mutationType),
      },
    });
  },
};
