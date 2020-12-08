import http from 'http';
import Cookies from 'cookies';
import { ShopifyOAuth } from '../auth/oauth/oauth';
import { Context } from '../context';
import { Session } from '../auth/session';

/**
 * Loads the current user's session, based on the given request.
 *
 * @param req Current HTTP request
 * @param res Current HTTP response
 */
export default async function loadCurrentSession(request: http.IncomingMessage, response: http.ServerResponse): Promise<Session | null> {
  Context.throwIfUnitialized();

  let session: Session | null = null;

  if (Context.IS_EMBEDDED_APP) {
    // TODO load session from JWT token
  }
  else {
    const cookies = new Cookies(request, response, {
      keys: [Context.API_SECRET_KEY],
    });

    const sessionCookie: string | undefined = cookies.get(
      ShopifyOAuth.SESSION_COOKIE_NAME,
      { signed: true }
    );

    if (sessionCookie) {
      session = await Context.loadSession(sessionCookie);
    }
  }

  return session;
}
