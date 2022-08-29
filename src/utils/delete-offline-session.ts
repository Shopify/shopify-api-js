import {ConfigInterface} from '../base-types';
import OAuth from '../auth/oauth';

import {sanitizeShop} from './shop-validator';

export function createDeleteOfflineSession(config: ConfigInterface) {
  return async (shop: string): Promise<boolean> => {
    const cleanShop = sanitizeShop(shop, true)!;

    const sessionId = OAuth.getOfflineSessionId(cleanShop);

    return config.sessionStorage.deleteSession(sessionId);
  };
}
