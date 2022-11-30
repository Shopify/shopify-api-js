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
<<<<<<< HEAD:src/base_types.ts
  April19 = '2019-04',
  July19 = '2019-07',
  October19 = '2019-10',
  January20 = '2020-01',
  April20 = '2020-04',
  July20 = '2020-07',
  October20 = '2020-10',
  January21 = '2021-01',
=======
  October21 = '2021-10',
  January22 = '2022-01',
  April22 = '2022-04',
  July22 = '2022-07',
  October22 = '2022-10',
>>>>>>> 1f7ba05d (Add support for 2022-10 version):src/base-types.ts
  Unstable = 'unstable',
  Unversioned = 'unversioned',
}

<<<<<<< HEAD:src/base_types.ts
=======
export const LATEST_API_VERSION = ApiVersion.October22;

>>>>>>> 1f7ba05d (Add support for 2022-10 version):src/base-types.ts
export enum ShopifyHeader {
  AccessToken = 'X-Shopify-Access-Token',
  Hmac = 'X-Shopify-Hmac-Sha256',
  Topic = 'X-Shopify-Topic',
  Domain = 'X-Shopify-Shop-Domain',
  WebhookId = 'X-Shopify-Webhook-Id',
}
