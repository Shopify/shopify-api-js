import {ConfigParams, Shopify} from './base-types';
import {validateConfig} from './config';
import {createClientClasses} from './clients';

export * from './error';
export * from './types';

export function shopifyApi(config: ConfigParams): Shopify {
  const validatedConfig = validateConfig(config);

  return {
    config: validatedConfig,
    clients: createClientClasses(validatedConfig),
  };
}
