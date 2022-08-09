import {SessionStorage} from './auth/session';
import {AuthScopes} from './auth/scopes';
<<<<<<< HEAD:src/base_types.ts
=======
import {SessionStorage} from './auth/session/session_storage';
import {BillingSettings} from './billing/types';
>>>>>>> 85c72bea (Add billing support):src/base-types.ts

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
<<<<<<< HEAD:src/base_types.ts
=======
  PRIVATE_APP_STOREFRONT_ACCESS_TOKEN?: string;
  CUSTOM_SHOP_DOMAINS?: (RegExp | string)[];
  BILLING?: BillingSettings;
>>>>>>> 85c72bea (Add billing support):src/base-types.ts
}

export enum ApiVersion {
  April19 = '2019-04',
  July19 = '2019-07',
  October19 = '2019-10',
  January20 = '2020-01',
  April20 = '2020-04',
  July20 = '2020-07',
  October20 = '2020-10',
  January21 = '2021-01',
  Unstable = 'unstable',
  Unversioned = 'unversioned',
}

export enum ShopifyHeader {
  AccessToken = 'X-Shopify-Access-Token',
  Hmac = 'X-Shopify-Hmac-Sha256',
  Topic = 'X-Shopify-Topic',
  Domain = 'X-Shopify-Shop-Domain',
}
