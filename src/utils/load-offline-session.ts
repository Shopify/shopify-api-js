import {Session} from '../auth/session/session';
import OAuth from '../auth/oauth';
import {ConfigInterface} from '../base-types';

import {sanitizeShop} from './shop-validator';

export function createLoadOfflineSession(config: ConfigInterface) {
  return async (
    shop: string,
    includeExpired = false,
  ): Promise<Session | undefined> => {
    const cleanShop = sanitizeShop(shop, true)!;

    const sessionId = OAuth.getOfflineSessionId(cleanShop);
    const session = await config.sessionStorage.loadSession(sessionId);

    const now = new Date();

    if (
      session &&
      !includeExpired &&
      session.expires &&
      session.expires.getTime() < now.getTime()
    ) {
      return undefined;
    }

    return session;
  };
}
