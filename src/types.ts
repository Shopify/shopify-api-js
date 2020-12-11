import { SessionStorage } from './auth/session';

export interface ContextParams {
  API_KEY: string,
  API_SECRET_KEY: string,
  SCOPES: string[],
  HOST_NAME: string,
  API_VERSION: ApiVersion,
  IS_EMBEDDED_APP: boolean,
  SESSION_STORAGE?: SessionStorage,
}

export enum ApiVersion {
  April19 = '2019-04',
  July19 = '2019-07',
  October19 = '2019-10',
  January20 = '2020-01',
  April20 = '2020-04',
  July20 = '2020-07',
  October20 = '2020-10',
  Unstable = 'unstable',
  Unversioned = 'unversioned',
}

export enum ShopifyHeader {
  AccessToken = 'X-Shopify-Access-Token',
  Hmac = 'X-Shopify-Hmac-Sha256',
  Topic = 'X-Shopify-Topic',
  Domain = 'X-Shopify-Shop-Domain',
}

export * from './webhooks/types';
export * from './auth/types';
export * from './clients/types';
