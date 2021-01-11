import {Context} from './context';
import * as ShopifyErrors from './error';
import ShopifyAuth from './auth/oauth';
import ShopifyBilling from './billing';
import ShopifySession from './auth/session';
import ShopifyClients from './clients';
import ShopifyUtils from './utils';
import ShopifyWebhooks from './webhooks';

<<<<<<< HEAD
export const Shopify = {
=======
const Shopify = {
>>>>>>> e83b5faf (Run yarn lint --fix on all files)
  Context,
  Auth: ShopifyAuth,
  Billing: ShopifyBilling,
  Session: ShopifySession,
  Clients: ShopifyClients,
  Utils: ShopifyUtils,
  Webhooks: ShopifyWebhooks,
  Errors: ShopifyErrors,
};

export default Shopify;
export * from './types';
