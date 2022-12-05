import {ConfigInterface} from '../base-types';

import {decodeSessionToken} from './decode-session-token';
import {getCurrentSessionId, getOfflineId} from './session-utils';

export function shopifySession(config: ConfigInterface) {
  return {
    getCurrentId: getCurrentSessionId(config),
    getOfflineId: getOfflineId(config),
    decodeSessionToken: decodeSessionToken(config),
  };
}

export type ShopifySession = ReturnType<typeof shopifySession>;
