import {Context} from './context';
import * as ShopifyErrors from './error';
import ShopifyAuth from './auth/oauth';
import ShopifySession from './auth/session';
import ShopifyClients from './clients';
import ShopifyUtils from './utils';
import ShopifyWebhooks from './webhooks';

export const Shopify = {
  Context,
  Auth: ShopifyAuth,
  Session: ShopifySession,
  Clients: ShopifyClients,
  Utils: ShopifyUtils,
  Webhooks: ShopifyWebhooks,
  Errors: ShopifyErrors,
};

export default Shopify;
export * from './types';
