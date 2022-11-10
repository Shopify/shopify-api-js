import {ShopifyError} from './error';
import {ConfigInterface, ConfigParams} from './base-types';
import {LATEST_API_VERSION, LogSeverity} from './types';
import {AuthScopes} from './auth/scopes';

export function validateConfig(params: ConfigParams<any>): ConfigInterface {
  const config: ConfigInterface = {
    apiKey: '',
    apiSecretKey: '',
    scopes: new AuthScopes([]),
    hostName: '',
    hostScheme: 'https',
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: true,
    isPrivateApp: false,
    logger: {
      log: defaultLogFunction,
      level: LogSeverity.Info,
      httpRequests: false,
      timestamps: false,
    },
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
    hostScheme,
    isPrivateApp,
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
    isPrivateApp:
      isPrivateApp === undefined ? config.isPrivateApp : isPrivateApp,
    userAgentPrefix: userAgentPrefix ?? config.userAgentPrefix,
    logger: {...config.logger, ...(logger || {})},
    privateAppStorefrontAccessToken:
      privateAppStorefrontAccessToken ?? config.privateAppStorefrontAccessToken,
    customShopDomains: customShopDomains ?? config.customShopDomains,
    billing: billing ?? config.billing,
  });

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

async function defaultLogFunction(
  severity: LogSeverity,
  message: string,
): Promise<void> {
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
