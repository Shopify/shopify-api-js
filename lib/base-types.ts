import {ShopifyRestResources} from '../rest/types';

import {AuthScopes} from './auth/scopes';
import {BillingConfig} from './billing/types';
import {ApiVersion, LogSeverity} from './types';

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
