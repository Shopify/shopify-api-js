import {ConfigInterface} from '../base-types';

import {sanitizeShop, sanitizeHost} from './shop-validator';
import {validateHmac} from './hmac-validator';
import {versionCompatible} from './version-compatible';

export function shopifyUtils(config: ConfigInterface) {
  return {
    sanitizeShop: sanitizeShop(config),
    sanitizeHost: sanitizeHost(config),
    validateHmac: validateHmac(config),
    versionCompatible: versionCompatible(config),
  };
}

export type ShopifyUtils = ReturnType<typeof shopifyUtils>;
