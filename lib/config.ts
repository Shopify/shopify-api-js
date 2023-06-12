import {ShopifyError} from './error';
import {ConfigInterface, ConfigParams} from './base-types';
import {LATEST_API_VERSION, LogSeverity} from './types';
import {AuthScopes} from './auth/scopes';
import {logger as createLogger} from './logger';
import {enableCodeAfterVersion} from './utils/versioned-codeblocks';

export function validateConfig(params: ConfigParams<any>): ConfigInterface {
  const config: ConfigInterface = {
    apiKey: '',
    apiSecretKey: '',
    scopes: new AuthScopes([]),
    hostName: '',
    hostScheme: 'https',
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: true,
    isCustomStoreApp: false,
    logger: {
      log: defaultLogFunction,
      level: LogSeverity.Info,
      httpRequests: false,
      timestamps: false,
    },
  };

  // Make sure that the essential params actually have content in them
  const mandatory: (keyof ConfigParams)[] = ['apiSecretKey', 'hostName'];
  if (!('isCustomStoreApp' in params) || !params.isCustomStoreApp) {
    mandatory.push('apiKey');
    mandatory.push('scopes');
  }
  enableCodeAfterVersion('8.0.0', () => {
    if ('isCustomStoreApp' in params && params.isCustomStoreApp) {
      if (
        !('adminApiAccessToken' in params) ||
        params.adminApiAccessToken?.length === 0
      ) {
        mandatory.push('adminApiAccessToken');
      }
    }
  });
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
    hostScheme,
    isCustomStoreApp,
    adminApiAccessToken,
    userAgentPrefix,
    logger,
    privateAppStorefrontAccessToken,
    customShopDomains,
    billing,
    ...mandatoryParams
  } = params;

  Object.assign(config, mandatoryParams, {
    hostName: params.hostName.replace(/\/$/, ''),
    scopes:
      params.scopes instanceof AuthScopes
        ? params.scopes
        : new AuthScopes(params.scopes),
    hostScheme: hostScheme ?? config.hostScheme,
    isCustomStoreApp: isCustomStoreApp ?? config.isCustomStoreApp,
    adminApiAccessToken: adminApiAccessToken ?? config.adminApiAccessToken,
    userAgentPrefix: userAgentPrefix ?? config.userAgentPrefix,
    logger: {...config.logger, ...(logger || {})},
    privateAppStorefrontAccessToken:
      privateAppStorefrontAccessToken ?? config.privateAppStorefrontAccessToken,
    customShopDomains: customShopDomains ?? config.customShopDomains,
    billing: billing ?? config.billing,
  });

  if ('isCustomStoreApp' in params && params.isCustomStoreApp) {
    if (
      !('adminApiAccessToken' in params) ||
      params.adminApiAccessToken?.length === 0
    ) {
      createLogger(config).deprecated(
        '8.0.0',
        "adminApiAccessToken should be set to the Admin API access token for custom store apps; apiSecretKey should be set to the custom store app's API secret key.",
      );
    } else if (params.adminApiAccessToken === params.apiSecretKey) {
      createLogger(config).warning(
        "adminApiAccessToken is set to the same value as apiSecretKey. adminApiAccessToken should be set to the Admin API access token for custom store apps; apiSecretKey should be set to the custom store app's API secret key.",
      );
    }
  }

  return config;
}

function notEmpty<T>(value: T): value is NonNullable<T> {
  if (value == null) {
    return false;
  }
  return typeof value === 'string' || Array.isArray(value)
    ? value.length > 0
    : true;
}

function defaultLogFunction(severity: LogSeverity, message: string): void {
  switch (severity) {
    case LogSeverity.Debug:
      console.debug(message);
      break;
    case LogSeverity.Info:
      console.log(message);
      break;
    case LogSeverity.Warning:
      console.warn(message);
      break;
    case LogSeverity.Error:
      console.error(message);
      break;
  }
}
