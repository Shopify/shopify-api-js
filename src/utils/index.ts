import {ConfigInterface} from '../base-types';

import {createSanitizeShop, createSanitizeHost} from './shop-validator';
import {createValidateHmac} from './hmac-validator';
import {createVersionCompatible} from './version-compatible';

export function shopifyUtils(config: ConfigInterface) {
  return {
    sanitizeShop: createSanitizeShop(config),
    sanitizeHost: createSanitizeHost(config),
    validateHmac: createValidateHmac(config),
    versionCompatible: createVersionCompatible(config),
  };
}
