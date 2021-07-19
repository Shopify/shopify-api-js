import http from 'http';

import {Context} from '../context';
import {ShopifyOAuth} from '../auth/oauth/oauth';
import * as ShopifyErrors from '../error';

/**
 * Finds and deletes the current user's session, based on the given request and response
 *
 * @param request  Current HTTP request
 * @param response Current HTTP response
 * @param isOnline Whether to load online (default) or offline sessions (optional)
 */
export default async function deleteCurrentSession(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  isOnline = true,
): Promise<boolean | never> {
  Context.throwIfUninitialized();

  const sessionId = ShopifyOAuth.getCurrentSessionId(
    request,
    response,
    isOnline,
  );
  if (!sessionId) {
    throw new ShopifyErrors.SessionNotFound('No active session found.');
  }

  return Context.SESSION_STORAGE.deleteSession(sessionId);
}
