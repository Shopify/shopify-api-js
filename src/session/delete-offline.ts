import {ConfigInterface} from '../base-types';
import {createSanitizeShop} from '../utils/shop-validator';

import {createGetOfflineId} from './session-utils';
import {SessionDeleteOfflineParams} from './types';

export function createDeleteOffline(config: ConfigInterface) {
  return async ({shop}: SessionDeleteOfflineParams): Promise<boolean> => {
    const cleanShop = createSanitizeShop(config)(shop, true)!;

    const sessionId = createGetOfflineId(config)(cleanShop);

    return config.sessionStorage.deleteSession(sessionId);
  };
}
