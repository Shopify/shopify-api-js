import { loadRestResources } from '../rest/load-rest-resources';
import { ShopifyRestResources } from '../rest/types';

import { shopifyAuth } from './auth';
import { ConfigParams, Shopify } from './base-types';
import { shopifyBilling } from './billing';
import { validateConfig } from './config';
import { shopifySession } from './session';
import { shopifyUtils } from './utils';
import { shopifyWebhooks } from './webhooks';

export * from './error';
export * from './session/classes';

export * from '../rest/types';
export * from './auth/types';
export * from './base-types';
export * from './billing/types';
export * from './clients/types';
export * from './session/types';
export * from './types';
export * from './webhooks/types';

// Temporarily export the deprecated v5 types as a Shopify object (as opposed to the type above) to help folks find
// the migration guide.
export const Shopify: DeprecatedV5Types = {};

export interface Shopify<
  T extends ShopifyRestResources = ShopifyRestResources,
> {
  config: ConfigInterface;
  clients: ShopifyClients;
  auth: ShopifyAuth;
  session: ShopifySession;
  utils: ShopifyUtils;
  webhooks: ShopifyWebhooks;
  billing: ShopifyBilling;
  logger: ShopifyLogger;
  rest: T;
}

export function shopifyApi<T extends ShopifyRestResources>(
  config: ConfigParams<T>,
): Shopify<T> {
  const {restResources, ...libConfig} = config;
  const validatedConfig = validateConfig(libConfig);

  const shopify: Shopify<T> = {
    config: validatedConfig,
    clients: clientClasses(validatedConfig),
    auth: shopifyAuth(validatedConfig),
    session: shopifySession(validatedConfig),
    utils: shopifyUtils(validatedConfig),
    webhooks: shopifyWebhooks(validatedConfig),
    billing: shopifyBilling(validatedConfig),
    logger: logger(validatedConfig),
    rest: {} as T,
  };

  if (restResources) {
    shopify.rest = loadRestResources({
      resources: restResources,
      config: validatedConfig,
      RestClient: shopify.clients.Rest,
    }) as T;
  }

  shopify.logger
    .info(
      `version ${SHOPIFY_API_LIBRARY_VERSION}, environment ${abstractRuntimeString()}`,
    )
    .catch((err) => console.log(err));

  const nodeVersionMatches = abstractRuntimeString().match(
    /(Node) (v\d+\.\d+\.\d+)/,
  );
  const isNode = nodeVersionMatches && nodeVersionMatches[1] === 'Node';
  const nodeVersion = nodeVersionMatches ? nodeVersionMatches[2] : '';
  if (isNode && compare(nodeVersion, '16.0.0', '<')) {
    shopify.logger.deprecated(
      '8.0.0',
      `Support for ${abstractRuntimeString()} will be removed - please upgrade to Node v16.0.0 or higher.`,
    );
  }

  return shopify;
}
