import {ConfigInterface} from '../base-types';

import {sanitizeShop, sanitizeHost} from './shop-validator';
import {validateHmac} from './hmac-validator';
import {versionCompatible, versionPriorTo} from './version-compatible';
import {
  unifiedAdminUrlToLegacyUrl,
  legacyUrlToUnifiedAdminUrl,
} from './unified-admin-url-helper';

export function shopifyUtils(config: ConfigInterface) {
  return {
    sanitizeShop: sanitizeShop(config),
    sanitizeHost: sanitizeHost(),
    validateHmac: validateHmac(config),
    versionCompatible: versionCompatible(config),
    versionPriorTo: versionPriorTo(config),
    unifiedAdminUrlToLegacyUrl: unifiedAdminUrlToLegacyUrl(),
    legacyUrlToUnifiedAdminUrl: legacyUrlToUnifiedAdminUrl(),
  };
}

export type ShopifyUtils = ReturnType<typeof shopifyUtils>;
