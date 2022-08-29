import {Shopify} from '../base-types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      shopify: Shopify;
    }
  }
}
