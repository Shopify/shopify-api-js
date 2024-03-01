import type { Types } from "@graphql-codegen/plugin-helpers";
import { preset as hydrogenPreset } from "@shopify/graphql-codegen";

import { type ShopifyApiPresetConfig } from "./types";
import { apiConfigs } from "./helpers/api-configs";

export const preset: Types.OutputPreset<ShopifyApiPresetConfig> = {
  buildGeneratesSection: (options) => {
    const apiType = options.presetConfig.apiType;

    const { interfaceExtension, module, presetConfigs } = apiConfigs[apiType];

    return hydrogenPreset.buildGeneratesSection({
      ...options,
      presetConfig: {
        ...presetConfigs,
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
