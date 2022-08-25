import {ShopifyError, PrivateAppError} from './error';
import {SessionStorage} from './auth/session/session_storage';
import {ConfigInterface, ConfigParams, LATEST_API_VERSION} from './base-types';
import {AuthScopes} from './auth/scopes';
import {MemorySessionStorage} from './auth/session/storage/memory';

export function validateConfig(params: ConfigParams): ConfigInterface {
  const config: ConfigInterface = {
    apiKey: '',
    apiSecretKey: '',
    scopes: new AuthScopes([]),
    hostName: '',
    hostScheme: 'https',
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: true,
    isPrivateApp: false,
    // TS hack as sessionStorage is guaranteed to be set
    // to a correct value in `initialize()`.
    sessionStorage: null as unknown as SessionStorage,
  };

  // Make sure that the essential params actually have content in them
  const mandatory: (keyof ConfigParams)[] = [
    'apiKey',
    'apiSecretKey',
    'scopes',
    'hostName',
  ];
  const missing: (keyof ConfigParams)[] = [];
  mandatory.forEach((key) => {
    if (!notEmpty(params[key])) {
      missing.push(key);
    }
  });

  if (missing.length) {
    throw new ShopifyError(
      `Cannot initialize Shopify API Library. Missing values for: ${missing.join(
        ', ',
      )}`,
    );
  }

  const {
    sessionStorage,
    hostScheme,
    isPrivateApp,
    userAgentPrefix,
    logFile,
    privateAppStorefrontAccessToken,
    customShopDomains,
    billing,
    ...mandatoryParams
  } = params;

  Object.assign(config, mandatoryParams, {
    scopes:
      params.scopes instanceof AuthScopes
        ? params.scopes
        : new AuthScopes(params.scopes),
    sessionStorage: sessionStorage ?? new MemorySessionStorage(),
    hostScheme: hostScheme ?? config.hostScheme,
    isPrivateApp:
      isPrivateApp === undefined ? config.isPrivateApp : isPrivateApp,
    userAgentPrefix: userAgentPrefix ?? config.userAgentPrefix,
    logFile: logFile ?? config.logFile,
    privateAppStorefrontAccessToken:
      privateAppStorefrontAccessToken ?? config.privateAppStorefrontAccessToken,
    customShopDomains: customShopDomains ?? config.customShopDomains,
    billing: billing ?? config.billing,
  });

  config.sessionStorage.setConfig(config);

  return config;
}

export function throwIfPrivateApp(
  config: ConfigInterface,
  message: string,
): void {
  if (config.isPrivateApp) {
    throw new PrivateAppError(message);
  }
}

function notEmpty<T>(value: T): value is NonNullable<T> {
  if (value == null) {
    return false;
  }
  return typeof value === 'string' || Array.isArray(value)
    ? value.length > 0
    : true;
}
