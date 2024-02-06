import {ConfigInterface} from '../base-types';

import {validateFactory} from './validate';

export function shopifyFlow(config: ConfigInterface) {
  return {
    validate: validateFactory(config),
  };
}

export type ShopifyFlow = ReturnType<typeof shopifyFlow>;
