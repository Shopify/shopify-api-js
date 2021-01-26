import http from 'http';

import Cookies from 'cookies';

import {Context} from '../context';
import * as ShopifyErrors from '../error';
import {ShopifyOAuth} from '../auth/oauth/oauth';

import decodeSessionToken from './decode-session-token';

/**
 * Finds and deletes the current user's session, based on the given request and response
 *
 * @param req Current HTTP request
 * @param res Current HTTP response
 */
export default async function deleteCurrentSession(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<boolean | never> {
  Context.throwIfUninitialized();

  if (Context.IS_EMBEDDED_APP) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const matches = authHeader.match(/^Bearer (.+)$/);
      if (!matches) {
        throw new ShopifyErrors.MissingJwtTokenError('Missing Bearer token in authorization header');
      }

      const jwtPayload = decodeSessionToken(matches[1]);
      const jwtSessionId = ShopifyOAuth.getJwtSessionId(jwtPayload.dest.replace(/^https:\/\//, ''), jwtPayload.sub);
      await Context.SESSION_STORAGE.deleteSession(jwtSessionId);
      return true;
    } else {
      throw new ShopifyErrors.MissingJwtTokenError('Missing authorization header');
    }
  } else {
    const cookies = new Cookies(req, res, {
      secure: true,
      keys: [Context.API_SECRET_KEY],
    });

    const sessionCookie: string | undefined = cookies.get(ShopifyOAuth.SESSION_COOKIE_NAME, {signed: true});

    if (sessionCookie) {
      await Context.SESSION_STORAGE.deleteSession(sessionCookie);
      cookies.set(ShopifyOAuth.SESSION_COOKIE_NAME);
      return true;
    } else {
      throw new ShopifyErrors.SessionNotFound('No active cookie session found.');
    }
  }
}
