import {ConfigInterface} from '../base-types';

import {decodeSessionToken} from './decode-session-token';
import {createDeleteCurrentSession} from './delete-current-session';
import {createDeleteOfflineSession} from './delete-offline-session';
import {createLoadCurrentSession} from './load-current-session';
import {createLoadOfflineSession} from './load-offline-session';
import {nonce} from './nonce';
import {graphqlProxy} from './graphql_proxy';
import {safeCompare} from './safe-compare';
import {createStoreSession} from './store-session';
import {validateHmac} from './hmac-validator';
import {createSanitizeShop, createSanitizeHost} from './shop-validator';
import {createVersionCompatible} from './version-compatible';
import {createWithSession} from './with-session';
import {createGetEmbeddedAppUrl} from './get-embedded-app-url';

export function shopifyUtils(config: ConfigInterface) {
  return {
    decodeSessionToken,
    deleteCurrentSession: createDeleteCurrentSession(config),
    deleteOfflineSession: createDeleteOfflineSession(config),
    loadCurrentSession: createLoadCurrentSession(config),
    loadOfflineSession: createLoadOfflineSession(config),
    nonce,
    graphqlProxy,
    safeCompare,
    storeSession: createStoreSession(config),
    validateHmac,
    sanitizeShop: createSanitizeShop(config),
    sanitizeHost: createSanitizeHost(config),
    versionCompatible: createVersionCompatible(config),
    withSession: createWithSession(config),
    getEmbeddedAppUrl: createGetEmbeddedAppUrl(config),
  };
}
