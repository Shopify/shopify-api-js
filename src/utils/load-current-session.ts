import http from 'http';

import {Context} from '../context';
import {ShopifyOAuth} from '../auth/oauth/oauth';
import {Session} from '../auth/session';

/**
 * Loads the current user's session, based on the given request and response.
 *
 * @param request  Current HTTP request
 * @param response Current HTTP response
 * @param isOnline Whether to load online (default) or offline sessions (optional)
 */
export default async function loadCurrentSession(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  isOnline = true,
): Promise<Session | undefined> {
  Context.throwIfUninitialized();

  const sessionId = ShopifyOAuth.getCurrentSessionId(
    request,
    response,
    isOnline,
  );
  if (!sessionId) {
    return Promise.resolve(undefined);
  }

  return Context.SESSION_STORAGE.loadSession(sessionId);
}
