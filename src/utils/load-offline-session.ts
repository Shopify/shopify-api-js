import {Session} from '../session/session';
import OAuth from '../auth/oauth';
import {ConfigInterface} from '../base-types';

import {createSanitizeShop} from './shop-validator';

export function createLoadOfflineSession(config: ConfigInterface) {
  return async (
    shop: string,
    includeExpired = false,
  ): Promise<Session | undefined> => {
    const cleanShop = createSanitizeShop(config)(shop, true)!;

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
