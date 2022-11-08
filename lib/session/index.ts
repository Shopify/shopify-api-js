import {ConfigInterface} from '../base-types';

import {createDecodeSessionToken} from './decode-session-token';
import {createGetCurrentSessionId, createGetOfflineId} from './session-utils';

export function shopifySession(config: ConfigInterface) {
  return {
    getCurrentId: createGetCurrentSessionId(config),
    getOfflineId: createGetOfflineId(config),
    decodeSessionToken: createDecodeSessionToken(config),
  };
}

export type ShopifySession = ReturnType<typeof shopifySession>;
