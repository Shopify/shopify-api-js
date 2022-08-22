import {ShopifyError, UninitializedConfigError, PrivateAppError} from './error';
import {SessionStorage} from './auth/session/session_storage';
import {ApiVersion, ConfigParams} from './base-types';
import {AuthScopes} from './auth/scopes';
import {MemorySessionStorage} from './auth/session/storage/memory';

interface ConfigInterface extends ConfigParams {
  HOST_SCHEME: string;
  SESSION_STORAGE: SessionStorage;
  SCOPES: AuthScopes;
}

export const config: ConfigInterface = {
  API_KEY: '',
  API_SECRET_KEY: '',
  SCOPES: new AuthScopes([]),
  HOST_NAME: '',
  HOST_SCHEME: 'https',
  API_VERSION: ApiVersion.Unstable,
  IS_EMBEDDED_APP: true,
  IS_PRIVATE_APP: false,
  // TS hack as SESSION_STORAGE is guaranteed to be set
  // to a correct value in `initialize()`.
  SESSION_STORAGE: null as unknown as SessionStorage,
};

export function setConfig(params: ConfigParams): void {
  let scopes: AuthScopes;
  if (params.SCOPES instanceof AuthScopes) {
    scopes = params.SCOPES;
  } else {
    scopes = new AuthScopes(params.SCOPES);
  }

  // Make sure that the essential params actually have content in them
  const missing: string[] = [];
  if (!params.API_KEY.length) {
    missing.push('API_KEY');
  }
  if (!params.API_SECRET_KEY.length) {
    missing.push('API_SECRET_KEY');
  }
  if (!scopes.toArray().length) {
    missing.push('SCOPES');
  }
  if (!params.HOST_NAME.length) {
    missing.push('HOST_NAME');
  }

  if (missing.length) {
    throw new ShopifyError(
      `Cannot initialize Shopify API Library. Missing values for: ${missing.join(
        ', ',
      )}`,
    );
  }

  config.API_KEY = params.API_KEY;
  config.API_SECRET_KEY = params.API_SECRET_KEY;
  config.SCOPES = scopes;
  config.HOST_NAME = params.HOST_NAME;
  config.API_VERSION = params.API_VERSION;
  config.IS_EMBEDDED_APP = params.IS_EMBEDDED_APP;
  config.IS_PRIVATE_APP = params.IS_PRIVATE_APP;
  config.SESSION_STORAGE = params.SESSION_STORAGE ?? new MemorySessionStorage();

  if (params.HOST_SCHEME) {
    config.HOST_SCHEME = params.HOST_SCHEME;
  }

  if (params.USER_AGENT_PREFIX) {
    config.USER_AGENT_PREFIX = params.USER_AGENT_PREFIX;
  }

  if (params.LOG_FILE) {
    config.LOG_FILE = params.LOG_FILE;
  }

  if (params.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN) {
    config.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN =
      params.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN;
  }

  if (params.CUSTOM_SHOP_DOMAINS) {
    config.CUSTOM_SHOP_DOMAINS = params.CUSTOM_SHOP_DOMAINS;
  }

  if (params.BILLING) {
    config.BILLING = params.BILLING;
  }
}

export function throwIfUninitializedConfig(): void {
  if (!config.API_KEY || config.API_KEY.length === 0) {
    throw new UninitializedConfigError(
      'Config has not been properly initialized. Please call setConfig() to setup your app config object.',
    );
  }
}

export function throwIfPrivateApp(message: string): void {
  if (config.IS_PRIVATE_APP) {
    throw new PrivateAppError(message);
  }
}
