import http from 'http';

import {Context} from '../context';
import {ShopifyOAuth} from '../auth/oauth/oauth';
import {Session} from '../auth/session';

/**
 * Loads the current user's session, based on the given request and response.
 *
 * @param req Current HTTP request
 * @param res Current HTTP response
 */
export default async function loadCurrentSession(
  request: http.IncomingMessage,
  response: http.ServerResponse,
): Promise<Session | undefined> {
  Context.throwIfUninitialized();

  const sessionId = ShopifyOAuth.getCurrentSessionId(request, response);
  if (!sessionId) {
    return Promise.resolve(undefined);
  }

  return Context.SESSION_STORAGE.loadSession(sessionId);
}
