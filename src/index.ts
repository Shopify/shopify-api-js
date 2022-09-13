import {ConfigParams, Shopify} from './base-types';
import {validateConfig} from './config';
import {createClientClasses} from './clients';
import {shopifyAuth} from './auth';
import {shopifySession} from './session';
import {shopifyUtils} from './utils';
import {shopifyWebhooks} from './webhooks';
import {loadRestResources} from './rest/load-rest-resources';
import {ShopifyRestResources} from './rest/types';

export * from './error';
export * from './types';
export * from './session/classes';

export function shopifyApi<T extends ShopifyRestResources>(
  config: ConfigParams<T>,
): Shopify<T> {
  const {restResources, ...libConfig} = config;
  const validatedConfig = validateConfig(libConfig);

  const shopify: Shopify<T> = {
    config: validatedConfig,
    clients: createClientClasses(validatedConfig),
    auth: shopifyAuth(validatedConfig),
    session: shopifySession(validatedConfig),
    utils: shopifyUtils(validatedConfig),
    webhooks: shopifyWebhooks(validatedConfig),
    rest: {} as T,
  };

  if (restResources) {
    shopify.rest = loadRestResources({
      resources: restResources,
      apiVersion: config.apiVersion,
      RestClient: shopify.clients.Rest,
    }) as T;
  }

  return shopify;
}
