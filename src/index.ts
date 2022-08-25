import {ConfigParams} from './base-types';
import {validateConfig} from './config';

export * from './error';
export * from './types';

export function Shopify(config: ConfigParams) {
  const validatedConfig = validateConfig(config);
  return {
    config: validatedConfig,
  };
}
