import {ConfigInterface} from '../base-types';
import OAuth from '../auth/oauth';

import {createSanitizeShop} from './shop-validator';

export function createDeleteOfflineSession(config: ConfigInterface) {
  return async (shop: string): Promise<boolean> => {
    const cleanShop = createSanitizeShop(config)(shop, true)!;

    const sessionId = OAuth.getOfflineSessionId(cleanShop);

    return config.sessionStorage.deleteSession(sessionId);
  };
}
