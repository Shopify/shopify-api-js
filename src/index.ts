import {Context} from './context';
import * as ShopifyErrors from './error';
import ShopifyAuth from './auth';
import ShopifyClients from './clients';
import ShopifyUtils from './utils';
import ShopifyWebhooks from './webhooks';

const Shopify = {
  Context,
  Auth: ShopifyAuth,
  Clients: ShopifyClients,
  Utils: ShopifyUtils,
  Webhooks: ShopifyWebhooks,
  Errors: ShopifyErrors,
};

export default Shopify;
export * from './types';
