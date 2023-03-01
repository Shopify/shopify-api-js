import {loadRestResources} from '../rest/load-rest-resources';
import {ShopifyRestResources} from '../rest/types';
import {abstractRuntimeString} from '../runtime/platform';

import {DeprecatedV5Types} from './deprecated-v5-types';
import {ConfigParams, ConfigInterface} from './base-types';
import {validateConfig} from './config';
import {clientClasses, ShopifyClients} from './clients';
import {shopifyAuth, ShopifyAuth} from './auth';
import {shopifySession, ShopifySession} from './session';
import {shopifyUtils, ShopifyUtils} from './utils';
import {shopifyWebhooks, ShopifyWebhooks} from './webhooks';
import {shopifyBilling, ShopifyBilling} from './billing';
import {logger, ShopifyLogger} from './logger';
import {SHOPIFY_API_LIBRARY_VERSION} from './version';

export * from './error';
export * from './session/classes';

export * from '../rest/types';
export * from './types';
export * from './base-types';
export * from './auth/types';
export * from './clients/types';
export * from './session/types';
export * from './webhooks/types';

// Temporarily export the deprecated v5 types as a Shopify object (as opposed to the type above) to help folks find
// the migration guide.
export const Shopify: DeprecatedV5Types = {};

export interface Shopify<
  T extends ShopifyRestResources = ShopifyRestResources,
> {
  /** The options used to set up the object, containing the validated parameters of the `shopifyApi` function. */
  config: ConfigInterface;
  /** Object containing clients to access Shopify APIs. */
  clients: ShopifyClients;
  /** Object containing functions to authenticate with Shopify APIs. */
  auth: ShopifyAuth;
  /** Object containing functions to manage Shopify sessions. */
  session: ShopifySession;
  /** Object containing general functions to help build apps. */
  utils: ShopifyUtils;
  /** Object containing functions to configure and handle Shopify webhooks. */
  webhooks: ShopifyWebhooks;
  /** Object containing functions to enable apps to bill merchants. */
  billing: ShopifyBilling;
  /** Object containing functions to log messages. */
  logger: ShopifyLogger;
  /** Object containing object-oriented representations of the Admin REST API. See the [API reference documentation](https://shopify.dev/docs/api/admin-rest) for details. */
  rest: T;
}

/**
 * Provides an instance of the Shopify API library.
 *
 * @param config - Configuration object
 * @returns object containing validated config, client classes, and library methods
 */
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

  return shopify;
}
