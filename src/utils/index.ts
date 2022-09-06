import {ConfigInterface} from '../base-types';

import {createDecodeSessionToken} from './decode-session-token';
import {nonce} from './nonce';
// import {createGraphqlProxy} from './graphql_proxy';
import {safeCompare} from './safe-compare';
import {createValidateHmac} from './hmac-validator';
import {createSanitizeShop, createSanitizeHost} from './shop-validator';
import {createVersionCompatible} from './version-compatible';
import {
  createGetEmbeddedAppUrl,
  createBuildEmbeddedAppUrl,
} from './get-embedded-app-url';

export function shopifyUtils(config: ConfigInterface) {
  return {
    decodeSessionToken: createDecodeSessionToken(config),
    nonce,
    // graphqlProxy: createGraphqlProxy(config),
    safeCompare,
    validateHmac: createValidateHmac(config),
    sanitizeShop: createSanitizeShop(config),
    sanitizeHost: createSanitizeHost(config),
    versionCompatible: createVersionCompatible(config),
    getEmbeddedAppUrl: createGetEmbeddedAppUrl(config),
    buildEmbeddedAppUrl: createBuildEmbeddedAppUrl(config),
  };
}
