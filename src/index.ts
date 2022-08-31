import {ConfigParams, Shopify} from './base-types';
import {validateConfig} from './config';
import {createClientClasses} from './clients';
import {shopifyUtils} from './utils';

export * from './error';
export * from './types';

export function shopifyApi(config: ConfigParams): Shopify {
  const validatedConfig = validateConfig(config);

  return {
    config: validatedConfig,
    clients: createClientClasses(validatedConfig),
    utils: shopifyUtils(validatedConfig),
  };
}
