import http from 'http';

import {Context} from '../context';
import {ShopifyOAuth} from '../auth/oauth/oauth';
import * as ShopifyErrors from '../error';

/**
 * Finds and deletes the current user's session, based on the given request and response
 *
 * @param req Current HTTP request
 * @param res Current HTTP response
 */
export default async function deleteCurrentSession(
  request: http.IncomingMessage,
  response: http.ServerResponse,
): Promise<boolean | never> {
  Context.throwIfUninitialized();

  const sessionId = ShopifyOAuth.getCurrentSessionId(request, response);
  if (!sessionId) {
    throw new ShopifyErrors.SessionNotFound('No active session found.');
  }

  return Context.SESSION_STORAGE.deleteSession(sessionId);
}
