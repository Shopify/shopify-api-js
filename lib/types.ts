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
  ApiVersion = 'X-Shopify-API-Version',
  Domain = 'X-Shopify-Shop-Domain',
  Hmac = 'X-Shopify-Hmac-Sha256',
  StorefrontAccessToken = 'X-Shopify-Storefront-Access-Token',
  Topic = 'X-Shopify-Topic',
  WebhookId = 'X-Shopify-Webhook-Id',
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
