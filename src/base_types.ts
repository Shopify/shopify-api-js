import {AuthScopes} from './auth/scopes';
import {SessionStorage} from './auth/session/session_storage';

export interface ContextParams {
  API_KEY: string;
  API_SECRET_KEY: string;
  SCOPES: string[] | AuthScopes;
  HOST_NAME: string;
  API_VERSION: ApiVersion;
  IS_EMBEDDED_APP: boolean;
  IS_PRIVATE_APP?: boolean;
  SESSION_STORAGE?: SessionStorage;
  LOG_FILE?: string;
  USER_AGENT_PREFIX?: string;
  PRIVATE_APP_STOREFRONT_ACCESS_TOKEN?: string;
}

export enum ApiVersion {
  April21 = '2021-04',
  July21 = '2021-07',
  October21 = '2021-10',
  January22 = '2022-01',
  April22 = '2022-04',
  Unstable = 'unstable',
}

export enum ShopifyHeader {
  AccessToken = 'X-Shopify-Access-Token',
  StorefrontAccessToken = 'X-Shopify-Storefront-Access-Token',
  Hmac = 'X-Shopify-Hmac-Sha256',
  Topic = 'X-Shopify-Topic',
  Domain = 'X-Shopify-Shop-Domain',
}
