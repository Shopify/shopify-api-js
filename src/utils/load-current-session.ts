import http from 'http';

import {ConfigInterface} from '../base-types';
import {ShopifyOAuth} from '../auth/oauth/oauth';
import {SessionInterface} from '../auth/session/types';

export function createLoadCurrentSession(config: ConfigInterface) {
  return async (
    request: http.IncomingMessage,
    response: http.ServerResponse,
    isOnline = true,
  ): Promise<SessionInterface | undefined> => {
    throwIfConfigNotSet();

    const sessionId = ShopifyOAuth.getCurrentSessionId(
      request,
      response,
      isOnline,
    );
    if (!sessionId) {
      return Promise.resolve(undefined);
    }

    return config.sessionStorage.loadSession(sessionId);
  };
}
