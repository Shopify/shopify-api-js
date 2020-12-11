import http from 'http';
import Cookies from 'cookies';
import { ShopifyOAuth } from '../auth/oauth/oauth';
import { Context } from '../context';
import { Session } from '../auth/session';
import decodeSessionToken from './decode-session-token';
import ShopifyErrors from '../error';

/**
 * Loads the current user's session, based on the given request.
 *
 * @param req Current HTTP request
 * @param res Current HTTP response
 * @param isOauthCall Whether to expect an ongoing OAuth flow. If there is one and a session token is given,
 *                    the session will be converted for future uses. Generally not necessary if using default OAuth
 */
export default async function loadCurrentSession(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  isOauthCall = false
): Promise<Session | null> {
  Context.throwIfUnitialized();

  const cookies = new Cookies(request, response, {
    secure: true,
    keys: [Context.API_SECRET_KEY],
  });
  const sessionCookie: string | undefined = cookies.get(
    ShopifyOAuth.SESSION_COOKIE_NAME,
    { signed: true }
  );

  let session: Session | null = null;

  if (!isOauthCall && Context.IS_EMBEDDED_APP) {
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const matches = authHeader.match(/^Bearer (.+)$/);
      if (!matches) {
        throw new ShopifyErrors.MissingJwtTokenError("Missing Bearer token in authorization header");
      }

      const jwtPayload = decodeSessionToken(matches[1]);
      session = await Context.loadSession(jwtPayload.sid);

      // JWT session does not exist. If there is an OAuth session, transfer it to a new JWT one
      if (!session && sessionCookie) {
        const oauthSession = await Context.loadSession(sessionCookie);
        if (oauthSession) {
          session = await Session.cloneSession(oauthSession, jwtPayload.sid);
          session.expires = new Date(jwtPayload.exp * 1000);

          await Context.storeSession(session);
          await Context.deleteSession(oauthSession.id);
        }
      }
    }
  }
  else {
    if (sessionCookie) {
      session = await Context.loadSession(sessionCookie);
    }
  }

  return session;
}
