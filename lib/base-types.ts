import {ShopifyRestResources} from '../rest/types';

import {AuthScopes} from './auth/scopes';
import {BillingConfig, ShopifyBilling} from './billing/types';
import {ShopifyClients} from './clients/types';
import {ShopifyAuth} from './auth/types';
import {ShopifySession} from './session/types';
import {ShopifyUtils} from './utils/types';
import {ShopifyWebhooks} from './webhooks/types';
import {ShopifyLogger} from './logger/types';

export type LogFunction = (severity: LogSeverity, msg: string) => Promise<void>;

export interface ConfigParams<T extends ShopifyRestResources = any> {
  apiKey: string;
  apiSecretKey: string;
  scopes: string[] | AuthScopes;
  hostName: string;
  hostScheme?: 'http' | 'https';
  apiVersion: ApiVersion;
  isEmbeddedApp: boolean;
  isPrivateApp?: boolean;
  logFunction?: (severity: LogSeverity, msg: string) => Promise<void>;
  userAgentPrefix?: string;
  privateAppStorefrontAccessToken?: string;
  customShopDomains?: (RegExp | string)[];
  billing?: BillingConfig;
  restResources?: T;
  logger?: {
    log?: LogFunction;
    level?: LogSeverity;
    httpRequests?: boolean;
    timestamps?: boolean;
  };
}

export interface ConfigInterface extends Omit<ConfigParams, 'restResources'> {
  hostScheme: 'http' | 'https';
  scopes: AuthScopes;
  isPrivateApp: boolean;
  logger: {
    log: LogFunction;
    level: LogSeverity;
    httpRequests: boolean;
    timestamps: boolean;
  };
}

export interface Shopify<
  T extends ShopifyRestResources = ShopifyRestResources,
> {
  config: ConfigInterface;
  clients: ShopifyClients;
  auth: ShopifyAuth;
  session: ShopifySession;
  utils: ShopifyUtils;
  webhooks: ShopifyWebhooks;
  billing: ShopifyBilling;
  logger: ShopifyLogger;
  rest: T;
}

export enum LogSeverity {
  Error,
  Warning,
  Info,
  Debug,
}

export enum ApiVersion {
  January22 = '2022-01',
  April22 = '2022-04',
  July22 = '2022-07',
  October22 = '2022-10',
  Unstable = 'unstable',
}

export const LATEST_API_VERSION = ApiVersion.October22;

export enum ShopifyHeader {
  AccessToken = 'X-Shopify-Access-Token',
  StorefrontAccessToken = 'X-Shopify-Storefront-Access-Token',
  Hmac = 'X-Shopify-Hmac-Sha256',
  Topic = 'X-Shopify-Topic',
  Domain = 'X-Shopify-Shop-Domain',
}

export enum ClientType {
  Rest = 'rest',
  Graphql = 'graphql',
}

export const gdprTopics: string[] = [
  'CUSTOMERS_DATA_REQUEST',
  'CUSTOMERS_REDACT',
  'SHOP_REDACT',
];

export enum BillingInterval {
  OneTime = 'ONE_TIME',
  Every30Days = 'EVERY_30_DAYS',
  Annual = 'ANNUAL',
}

export type RecurringBillingIntervals = Exclude<
  BillingInterval,
  BillingInterval.OneTime
>;

export enum BillingReplacementBehavior {
  ApplyImmediately = 'APPLY_IMMEDIATELY',
  ApplyOnNextBillingCycle = 'APPLY_ON_NEXT_BILLING_CYCLE',
  Standard = 'STANDARD',
}
