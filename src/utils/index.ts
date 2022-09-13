import {ConfigInterface} from '../base-types';

import {createDecodeSessionToken} from './decode-session-token';
import {nonce} from './nonce';
import {safeCompare} from './safe-compare';
import {createSanitizeShop, createSanitizeHost} from './shop-validator';
import {createValidateHmac} from './hmac-validator';
import {createVersionCompatible} from './version-compatible';

// eslint-disable-next-line no-warning-comments
// TODO refactor utils functions to take in objects for consistency (and update docs)
export function shopifyUtils(config: ConfigInterface) {
  return {
    decodeSessionToken: createDecodeSessionToken(config),
    nonce,
    safeCompare,
    sanitizeShop: createSanitizeShop(config),
    sanitizeHost: createSanitizeHost(config),
    validateHmac: createValidateHmac(config),
    versionCompatible: createVersionCompatible(config),
  };
}
