export enum LogSeverity {
  Error,
  Warning,
  Info,
  Debug,
}

export enum ApiVersion {
  October22 = '2022-10',
  January23 = '2023-01',
  April23 = '2023-04',
  July23 = '2023-07',
  October23 = '2023-10',
  January24 = '2024-01',
  April24 = '2024-04',
  Unstable = 'unstable',
}

export const LIBRARY_NAME = 'Shopify API Library';
export const LATEST_API_VERSION = ApiVersion.April24;

/* eslint-disable @shopify/typescript/prefer-pascal-case-enums */
export enum ShopifyHeader {
  AccessToken = 'X-Shopify-Access-Token',
  ApiVersion = 'X-Shopify-API-Version',
  Domain = 'X-Shopify-Shop-Domain',
  Hmac = 'X-Shopify-Hmac-Sha256',
  Topic = 'X-Shopify-Topic',
  SubTopic = 'X-Shopify-Sub-Topic',
  WebhookId = 'X-Shopify-Webhook-Id',
  StorefrontPrivateToken = 'Shopify-Storefront-Private-Token',
  StorefrontSDKVariant = 'X-SDK-Variant',
  StorefrontSDKVersion = 'X-SDK-Version',
}
/* eslint-enable @shopify/typescript/prefer-pascal-case-enums */

export enum ClientType {
  Rest = 'rest',
  Graphql = 'graphql',
}

export const privacyTopics: string[] = [
  'CUSTOMERS_DATA_REQUEST',
  'CUSTOMERS_REDACT',
  'SHOP_REDACT',
];

export enum BillingInterval {
  OneTime = 'ONE_TIME',
  Every30Days = 'EVERY_30_DAYS',
  Annual = 'ANNUAL',
  Usage = 'USAGE',
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
