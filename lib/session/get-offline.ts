import {ConfigInterface} from '../base-types';

import {createGetOfflineId} from './session-utils';
import {SessionGetOfflineParams, SessionInterface} from './types';

export function createGetOffline(config: ConfigInterface) {
  return async ({
    shop,
    includeExpired = false,
  }: SessionGetOfflineParams): Promise<SessionInterface | undefined> => {
    const sessionId = createGetOfflineId(config)(shop);
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
