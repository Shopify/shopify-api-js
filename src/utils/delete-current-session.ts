import http from 'http';

import {ConfigInterface} from '../base-types';
import {ShopifyOAuth} from '../auth/oauth/oauth';
import * as ShopifyErrors from '../error';

export function createDeleteCurrentSession(config: ConfigInterface) {
  return (
    request: http.IncomingMessage,
    response: http.ServerResponse,
    isOnline = true,
  ): Promise<boolean | never> => {
    const sessionId = ShopifyOAuth.getCurrentSessionId(
      request,
      response,
      isOnline,
    );
    if (!sessionId) {
      throw new ShopifyErrors.SessionNotFound('No active session found.');
    }

    return config.sessionStorage.deleteSession(sessionId);
  };
}
