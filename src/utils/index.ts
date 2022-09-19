import {ConfigInterface} from '../base-types';

import {createSanitizeShop, createSanitizeHost} from './shop-validator';
import {createValidateHmac} from './hmac-validator';
import {createVersionCompatible} from './version-compatible';

// eslint-disable-next-line no-warning-comments
// TODO refactor utils functions to take in objects for consistency (and update docs)
export function shopifyUtils(config: ConfigInterface) {
  return {
    sanitizeShop: createSanitizeShop(config),
    sanitizeHost: createSanitizeHost(config),
    validateHmac: createValidateHmac(config),
    versionCompatible: createVersionCompatible(config),
  };
}
