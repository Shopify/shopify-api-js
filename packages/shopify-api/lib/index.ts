import {loadRestResources} from '../rest/load-rest-resources';
import {ShopifyRestResources} from '../rest/types';
import {abstractRuntimeString} from '../runtime/platform';

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
export * from './billing/types';
export * from './clients/types';
export * from './session/types';
export * from './webhooks/types';

type DefaultedResources<Resources extends ShopifyRestResources | undefined> =
  Resources extends undefined ? ShopifyRestResources : Resources;

export interface Shopify<
  Params extends ConfigParams = ConfigParams,
  Resources extends DefaultedResources<
    Params['restResources']
  > = DefaultedResources<Params['restResources']>,
  Config extends ConfigInterface<Params> = ConfigInterface<Params>,
> {
  config: Config;
  clients: ShopifyClients;
  auth: ShopifyAuth;
  session: ShopifySession;
  utils: ShopifyUtils;
  webhooks: ShopifyWebhooks;
  billing: ShopifyBilling;
  logger: ShopifyLogger;
  rest: Resources;
}

export function shopifyApi<
  Params extends ConfigParams,
  Resources extends DefaultedResources<Params['restResources']>,
>(config: Params): Shopify<Params, Resources, ConfigInterface<Params>> {
  const {restResources, ...libConfig} = config;
  const validatedConfig = validateConfig<Resources, typeof libConfig>(
    libConfig,
  );

  const shopify = {
    config: validatedConfig,
    clients: clientClasses(validatedConfig),
    auth: shopifyAuth(validatedConfig),
    session: shopifySession(validatedConfig),
    utils: shopifyUtils(validatedConfig),
    webhooks: shopifyWebhooks(validatedConfig),
    billing: shopifyBilling(validatedConfig),
    logger: logger(validatedConfig),
    rest: {} as Resources,
  };

  if (restResources) {
    shopify.rest = loadRestResources<Resources>({
      resources: restResources as Resources,
      config: validatedConfig,
      RestClient: shopify.clients.Rest,
    });
  }

  shopify.logger
    .info(
      `version ${SHOPIFY_API_LIBRARY_VERSION}, environment ${abstractRuntimeString()}`,
    )
    .catch((err) => console.log(err));

  return shopify as Shopify<Params, Resources, ConfigInterface<Params>>;
}
