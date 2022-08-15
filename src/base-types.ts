import {AuthScopes} from './auth/scopes';
import {SessionStorage} from './auth/session/session_storage';
import {BillingSettings} from './billing/types';

export interface ContextParams {
  API_KEY: string;
  API_SECRET_KEY: string;
  SCOPES: string[] | AuthScopes;
  HOST_NAME: string;
  HOST_SCHEME?: string;
  API_VERSION: ApiVersion;
  IS_EMBEDDED_APP: boolean;
  IS_PRIVATE_APP?: boolean;
  SESSION_STORAGE?: SessionStorage;
  LOG_FILE?: string;
  USER_AGENT_PREFIX?: string;
  PRIVATE_APP_STOREFRONT_ACCESS_TOKEN?: string;
  CUSTOM_SHOP_DOMAINS?: (RegExp | string)[];
  BILLING?: BillingSettings;
}

export enum ApiVersion {
  October21 = '2021-10',
  January22 = '2022-01',
  April22 = '2022-04',
  July22 = '2022-07',
  Unstable = 'unstable',
}

export const LATEST_API_VERSION = ApiVersion.July22;

export enum ShopifyHeader {
  AccessToken = 'X-Shopify-Access-Token',
  StorefrontAccessToken = 'X-Shopify-Storefront-Access-Token',
  Hmac = 'X-Shopify-Hmac-Sha256',
  Topic = 'X-Shopify-Topic',
  Domain = 'X-Shopify-Shop-Domain',
}
