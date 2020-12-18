import http from 'http';

import { Context } from '../context';
import * as ShopifyErrors from '../error';
import { ShopifyOAuth } from '../auth/oauth/oauth';
import { Session } from '../auth/session';
import decodeSessionToken from './decode-session-token';

/**
 * Loads the current user's session, based on the given request and response.
 *
 * @param req Current HTTP request
 * @param res Current HTTP response
 */
export default async function loadCurrentSession(
  request: http.IncomingMessage,
  response: http.ServerResponse
): Promise<Session | null> {
  Context.throwIfUninitialized();

  let session: Session | null = null;

  if (Context.IS_EMBEDDED_APP) {
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      const matches = authHeader.match(/^Bearer (.+)$/);
      if (!matches) {
        throw new ShopifyErrors.MissingJwtTokenError("Missing Bearer token in authorization header");
      }

      const jwtPayload = decodeSessionToken(matches[1]);
      const jwtSessionId = ShopifyOAuth.getJwtSessionId(jwtPayload.dest.replace(/^https:\/\//, ''), jwtPayload.sub);
      session = await Context.loadSession(jwtSessionId);
    }
  }
  else {
    const sessionCookie = ShopifyOAuth.getCookieSessionId(request, response);
    if (sessionCookie) {
      session = await Context.loadSession(sessionCookie);
    }
  }

  return session;
}
