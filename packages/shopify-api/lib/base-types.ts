import {FutureFlagOptions} from '../future/flags';
import {ShopifyRestResources} from '../rest/types';

import {AuthScopes} from './auth/scopes';
import {BillingConfig} from './billing/types';
import {ApiVersion, LogSeverity} from './types';

export type LogFunction = (severity: LogSeverity, msg: string) => void;

export interface ConfigParams<
  Resources extends ShopifyRestResources = ShopifyRestResources,
> {
  apiKey?: string;
  apiSecretKey: string;
  scopes?: string[] | AuthScopes;
  hostName: string;
  hostScheme?: 'http' | 'https';
  apiVersion: ApiVersion;
  isEmbeddedApp: boolean;
  isCustomStoreApp?: boolean;
  adminApiAccessToken?: string;
  userAgentPrefix?: string;
  privateAppStorefrontAccessToken?: string;
  customShopDomains?: (RegExp | string)[];
  billing?: BillingConfig;
  restResources?: Resources;
  logger?: {
    log?: LogFunction;
    level?: LogSeverity;
    httpRequests?: boolean;
    timestamps?: boolean;
  };
  future?: FutureFlagOptions;
}

export type ConfigInterface<Params extends ConfigParams = ConfigParams> = Omit<
  Params,
  'restResources'
> & {
  apiKey: string;
  hostScheme: 'http' | 'https';
  scopes: AuthScopes;
  isCustomStoreApp: boolean;
  logger: {
    log: LogFunction;
    level: LogSeverity;
    httpRequests: boolean;
    timestamps: boolean;
  };
  future: FutureFlagOptions;
};
