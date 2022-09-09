import {ConfigParams, Shopify} from './base-types';
import {validateConfig} from './config';
import {createClientClasses} from './clients';
import {shopifyAuth} from './auth';
import {shopifySession} from './session';
import {shopifyUtils} from './utils';
import {shopifyWebhooks} from './webhooks';

export * from './error';
export * from './types';
export * from './session/classes';

export function shopifyApi(config: ConfigParams): Shopify {
  const validatedConfig = validateConfig(config);

  return {
    config: validatedConfig,
    clients: createClientClasses(validatedConfig),
    auth: shopifyAuth(validatedConfig),
    session: shopifySession(validatedConfig),
    utils: shopifyUtils(validatedConfig),
    webhooks: shopifyWebhooks(validatedConfig),
  };
}
