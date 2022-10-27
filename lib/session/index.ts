import {ConfigInterface} from '../base-types';

import {createDecodeSessionToken} from './decode-session-token';
import {createGetCurrentSessionId} from './session-utils';

export function shopifySession(config: ConfigInterface) {
  return {
    getCurrentId: createGetCurrentSessionId(config),
    decodeSessionToken: createDecodeSessionToken(config),
  };
}
