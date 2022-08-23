import {ShopifyError, UninitializedConfigError, PrivateAppError} from './error';
import {SessionStorage} from './auth/session/session_storage';
import {ApiVersion, ConfigParams} from './base-types';
import {AuthScopes} from './auth/scopes';
import {MemorySessionStorage} from './auth/session/storage/memory';

interface ConfigInterface extends ConfigParams {
  hostScheme: string;
  sessionStorage: SessionStorage;
  scopes: AuthScopes;
}

export const config: ConfigInterface = {
  apiKey: '',
  apiSecretKey: '',
  scopes: new AuthScopes([]),
  hostName: '',
  hostScheme: 'https',
  apiVersion: ApiVersion.Unstable,
  isEmbeddedApp: true,
  isPrivateApp: false,
  // TS hack as sessionStorage is guaranteed to be set
  // to a correct value in `initialize()`.
  sessionStorage: null as unknown as SessionStorage,
};

export function setConfig(params: ConfigParams): void {
  let scopes: AuthScopes;
  if (params.scopes instanceof AuthScopes) {
    scopes = params.scopes;
  } else {
    scopes = new AuthScopes(params.scopes);
  }

  // Make sure that the essential params actually have content in them
  const missing: string[] = [];
  if (!params.apiKey.length) {
    missing.push('apiKey');
  }
  if (!params.apiSecretKey.length) {
    missing.push('apiSecretKey');
  }
  if (!scopes.toArray().length) {
    missing.push('scopes');
  }
  if (!params.hostName.length) {
    missing.push('hostName');
  }

  if (missing.length) {
    throw new ShopifyError(
      `Cannot initialize Shopify API Library. Missing values for: ${missing.join(
        ', ',
      )}`,
    );
  }

  config.apiKey = params.apiKey;
  config.apiSecretKey = params.apiSecretKey;
  config.scopes = scopes;
  config.hostName = params.hostName;
  config.apiVersion = params.apiVersion;
  config.isEmbeddedApp = params.isEmbeddedApp;
  config.isPrivateApp = params.isPrivateApp;
  config.sessionStorage = params.sessionStorage ?? new MemorySessionStorage();

  if (params.hostScheme) {
    config.hostScheme = params.hostScheme;
  }

  if (params.userAgentPrefix) {
    config.userAgentPrefix = params.userAgentPrefix;
  }

  if (params.logFile) {
    config.logFile = params.logFile;
  }

  if (params.privateAppStorefrontAccessToken) {
    config.privateAppStorefrontAccessToken =
      params.privateAppStorefrontAccessToken;
  }

  if (params.customShopDomains) {
    config.customShopDomains = params.customShopDomains;
  }

  if (params.billing) {
    config.billing = params.billing;
  }
}

export function throwIfUninitializedConfig(): void {
  if (!config.apiKey || config.apiKey.length === 0) {
    throw new UninitializedConfigError(
      'Config has not been properly initialized. Please call setConfig() to setup your app config object.',
    );
  }
}

export function throwIfPrivateApp(message: string): void {
  if (config.isPrivateApp) {
    throw new PrivateAppError(message);
  }
}
