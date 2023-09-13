export enum LogSeverity {
  Error,
  Warning,
  Info,
  Debug,
}

export enum ApiVersion {
  April22 = '2022-04',
  July22 = '2022-07',
  October22 = '2022-10',
  January23 = '2023-01',
  April23 = '2023-04',
  July23 = '2023-07',
  Unstable = 'unstable',
}

export const LIBRARY_NAME = 'Shopify API Library';
export const LATEST_API_VERSION = ApiVersion.July23;

/* eslint-disable @shopify/typescript/prefer-pascal-case-enums */
export enum ShopifyHeader {
  AccessToken = 'X-Shopify-Access-Token',
  ApiVersion = 'X-Shopify-API-Version',
  Domain = 'X-Shopify-Shop-Domain',
  Hmac = 'X-Shopify-Hmac-Sha256',
  Topic = 'X-Shopify-Topic',
  WebhookId = 'X-Shopify-Webhook-Id',
  /** @deprecated This is a backend package and it should never call the SFAPI using public tokens */
  StorefrontAccessToken = 'X-Shopify-Storefront-Access-Token',
  StorefrontPrivateToken = 'Shopify-Storefront-Private-Token',
  StorefrontSDKVariant = 'X-SDK-Variant',
  StorefrontSDKVersion = 'X-SDK-Version',
}
/* eslint-enable @shopify/typescript/prefer-pascal-case-enums */

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
