import {ConfigInterface} from '../base-types';

import {createDecodeSessionToken} from './decode-session-token';
// eslint-disable-next-line no-warning-comments
// TODO we need to refactor the clients to be able to do this
// import {createDeleteCurrentSession} from './delete-current-session';
// import {createDeleteOfflineSession} from './delete-offline-session';
// import {createLoadCurrentSession} from './load-current-session';
// import {createLoadOfflineSession} from './load-offline-session';
import {nonce} from './nonce';
// eslint-disable-next-line no-warning-comments
// TODO we need to refactor the clients to be able to do this
// import {createGraphqlProxy} from './graphql_proxy';
import {safeCompare} from './safe-compare';
import {createValidateHmac} from './hmac-validator';
import {createSanitizeShop, createSanitizeHost} from './shop-validator';
import {createVersionCompatible} from './version-compatible';
// eslint-disable-next-line no-warning-comments
// TODO we need to refactor the clients to be able to do this
// import {createWithSession} from './with-session';
import {
  createGetEmbeddedAppUrl,
  createBuildEmbeddedAppUrl,
} from './get-embedded-app-url';

export function shopifyUtils(config: ConfigInterface) {
  return {
    decodeSessionToken: createDecodeSessionToken(config),
    // deleteCurrentSession: createDeleteCurrentSession(config),
    // deleteOfflineSession: createDeleteOfflineSession(config),
    // loadCurrentSession: createLoadCurrentSession(config),
    // loadOfflineSession: createLoadOfflineSession(config),
    nonce,
    // graphqlProxy: createGraphqlProxy(config),
    safeCompare,
    validateHmac: createValidateHmac(config),
    sanitizeShop: createSanitizeShop(config),
    sanitizeHost: createSanitizeHost(config),
    versionCompatible: createVersionCompatible(config),
    // withSession: createWithSession(config),
    getEmbeddedAppUrl: createGetEmbeddedAppUrl(config),
    buildEmbeddedAppUrl: createBuildEmbeddedAppUrl(config),
  };
}
