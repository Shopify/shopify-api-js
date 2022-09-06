import {AuthScopes} from './auth/scopes';
import {SessionStorage} from './session/session_storage';
import {BillingSettings} from './billing/types';
import {ShopifyClients} from './clients/types';
import {ShopifyUtils} from './utils/types';

export interface ConfigParams {
  apiKey: string;
  apiSecretKey: string;
  scopes: string[] | AuthScopes;
  hostName: string;
  hostScheme?: 'http' | 'https';
  apiVersion: ApiVersion;
  isEmbeddedApp: boolean;
  isPrivateApp?: boolean;
  sessionStorage?: SessionStorage;
  logFunction?: (severity: LogSeverity, msg: string) => Promise<void>;
  userAgentPrefix?: string;
  privateAppStorefrontAccessToken?: string;
  customShopDomains?: (RegExp | string)[];
  billing?: BillingSettings;
}

export interface ConfigInterface extends ConfigParams {
  hostScheme: 'http' | 'https';
  sessionStorage: SessionStorage;
  scopes: AuthScopes;
}

export interface Shopify {
  config: ConfigInterface;
  clients: ShopifyClients;
  utils: ShopifyUtils;
}

export enum LogSeverity {
  Error,
  Warning,
  Info,
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
