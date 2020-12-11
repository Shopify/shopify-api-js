import { Context } from './context';
import * as ShopifyErrors from './error';

const Shopify = {
  Context: Context,
  Errors: ShopifyErrors,
};

export default Shopify;
export * from './types';
