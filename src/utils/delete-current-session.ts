import {Request} from '../adapters/abstract-http';
import {Context} from '../context';
import {ShopifyOAuth} from '../auth/oauth/oauth';
import * as ShopifyErrors from '../error';

/**
 * Finds and deletes the current user's session, based on the given request
 *
 * @param request  Current HTTP request
 * @param isOnline Whether to load online (default) or offline sessions (optional)
 */
export default async function deleteCurrentSession(
  request: Request,
  isOnline = true,
): Promise<boolean | never> {
  Context.throwIfUninitialized();

  const sessionId = await ShopifyOAuth.getCurrentSessionId(request, isOnline);
  if (!sessionId) {
    throw new ShopifyErrors.SessionNotFound('No active session found.');
  }

  return Context.SESSION_STORAGE.deleteSession(sessionId);
}
