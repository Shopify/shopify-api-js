import {ShopifyRestResources} from '../rest/types';

import {AuthScopes} from './auth/scopes';
import {BillingConfig} from './billing/types';
import {ApiVersion, LogSeverity} from './types';

export type LogFunction = (severity: LogSeverity, msg: string) => Promise<void>;

export interface ConfigParams<T extends ShopifyRestResources = any> {
  /** API key for the app. You can find it in the Partners Dashboard. */
  apiKey: string;
  /** API secret key for the app. You can find it in the Partners Dashboard. */
  apiSecretKey: string;
  /** [Shopify scopes](https://shopify.dev/docs/api/usage/access-scopes) required for your app. */
  scopes: string[] | AuthScopes;
  /** App host name in the format `my-host-name.com`. Do not include the scheme or leading or trailing slashes. */
  hostName: string;
  /** The scheme for your app's public URL. Defaults to `"https"`. `"http"` is only allowed if your app is running on `localhost`. */
  hostScheme?: 'http' | 'https';
  /** API version your app will be querying, e.g., `ApiVersion.October22`. Defaults to `LATEST_API_VERSION` */
  apiVersion: ApiVersion;
  /** Whether your app will run within the Shopify Admin. Defaults to `true`. Learn more about embedded apps with [App Bridge](https://shopify.dev/docs/apps/tools/app-bridge/getting-started/app-setup) */
  isEmbeddedApp: boolean;
  /** Whether you are building a custom app for a store. Defaults to `false`. */
  isCustomStoreApp?: boolean;
  /** Any prefix you wish to include in the User-Agent for requests made by the library. Defaults to `undefined` */
  userAgentPrefix?: string;
  /** Fixed Storefront API access token for custom store apps. Defaults to `undefined` */
  privateAppStorefrontAccessToken?: string;
  /** Use this if you need to allow values other than myshopify.com. Defaults to `undefined` */
  customShopDomains?: (RegExp | string)[];
  /** Billing configurations. Defaults to `undefined`. See [documentation](https://github.com/Shopify/shopify-api-js/blob/main/docs/guides/billing.md) for full description. */
  billing?: BillingConfig;
  /** Mounts the given REST resources onto the object. Note: Must use the same version as `apiVersion`. Learn more about [using REST resources](https://github.com/Shopify/shopify-api-js/blob/main/docs/guides/rest-resources.md) */
  restResources?: T;
  /** Tweaks the behaviour of the package's internal logging to make it easier to debug applications. */
  logger?: {
    /** Async callback function used for logging, which takes in a `LogSeverity` value and a formatted message. Defaults to using console calls matching the severity parameter. */
    log?: LogFunction;
    /** Minimum severity for which to trigger the log function. Defaults to `LogSeverity.Info`. */
    level?: LogSeverity;
    /** Whether or not to log ALL HTTP requests made by the package. Defaults to `false`. Note: Only takes effect if `level` is set to `LogSeverity.Debug`. */
    httpRequests?: boolean;
    /** Whether or not to add the current timestamp to every logged message. Defaults to `false`. */
    timestamps?: boolean;
  };
}

export interface ConfigInterface extends Omit<ConfigParams, 'restResources'> {
  hostScheme: 'http' | 'https';
  scopes: AuthScopes;
  isCustomStoreApp: boolean;
  logger: {
    log: LogFunction;
    level: LogSeverity;
    httpRequests: boolean;
    timestamps: boolean;
  };
}
