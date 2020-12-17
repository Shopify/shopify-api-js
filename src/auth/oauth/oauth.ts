import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import Cookies from 'cookies';
import querystring from 'querystring';

import { Context } from '../../context';
import utils from '../../utils';
import { AuthQuery, AccessTokenResponse, OnlineAccessResponse, OnlineAccessInfo } from '../types';
import { Session } from '../session';
import { DataType, HttpClient } from '../../clients/http_client';
import * as ShopifyErrors from '../../error';

const ShopifyOAuth = {
  SESSION_COOKIE_NAME: 'shopify_app_session',

  /**
   * Initializes a session and cookie for the OAuth process, and returns the necessary authorization url.
   *
   * @param request Current HTTP Request
   * @param response Current HTTP Response
   * @param shop Shop url: {shop}.myshopify.com
   * @param redirect Redirect url for callback
   * @param isOnline Boolean value. If true, appends 'per-user' grant options to authorization url to receive online access token.
   *                 During final oauth request, will receive back the online access token and current online session information.
   *                 Defaults to offline access.
   */
  async beginAuth(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    shop: string,
    redirectPath: string,
    isOnline = false
  ): Promise<string> {
    Context.throwIfUninitialized();

    const cookies = new Cookies(request, response, {
      keys: [Context.API_SECRET_KEY],
      secure: true,
    });

    const state = utils.nonce();

    const session = new Session(isOnline ? uuidv4() : this.getOfflineSessionId(shop));
    session.shop = shop;
    session.state = state;
    session.isOnline = isOnline;

    await Context.storeSession(session);

    cookies.set(ShopifyOAuth.SESSION_COOKIE_NAME, session.id, {
      signed: true,
      expires: new Date(Date.now() + 60000),
      sameSite: 'none',
      secure: true,
    });

    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES.join(', '),
      redirect_uri: `https://${Context.HOST_NAME}${redirectPath}`,
      state: state,
      'grant_options[]': isOnline ? 'per-user' : '',
    };

    const queryString = querystring.stringify(query);

    return `https://${shop}/admin/oauth/authorize?${queryString}`;
  },

  /**
   * Validates the received callback query.
   * If valid, will make the subsequent request to update the current session with the appropriate access token.
   * Throws errors for missing sessions and invalid callbacks.
   *
   * @param request Current HTTP Request
   * @param response Current HTTP Response
   * @param query Current HTTP Request Query, containing the information to be validated.
   *              Depending on framework, this may need to be cast as "unknown" before being passed.
   */
  async validateAuthCallback(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    query: AuthQuery
  ): Promise<void> {
    Context.throwIfUninitialized();

    const cookies = new Cookies(request, response, {
      keys: [Context.API_SECRET_KEY],
      secure: true,
    });

    let currentSession: Session | null = null;

    const sessionCookie = this.getCookieSessionId(request, response);
    if (sessionCookie) {
      currentSession = await Context.loadSession(sessionCookie);
    }

    if (!currentSession) {
      throw new ShopifyErrors.SessionNotFound(
        `Cannot complete OAuth process. No session found for the specified shop url: ${query.shop}`
      );
    }

    if (!validQuery(query, currentSession)) {
      throw new ShopifyErrors.InvalidOAuthError('Invalid OAuth callback.');
    }

    const body = {
      client_id: Context.API_KEY,
      client_secret: Context.API_SECRET_KEY,
      code: query.code,
    };

    const postParams = {
      path: '/admin/oauth/access_token',
      type: DataType.JSON,
      data: body,
    };

    const client = new HttpClient(currentSession.shop);
    const postResponse = await client.post(postParams);

    if (currentSession.isOnline) {
      const responseBody = postResponse.body as OnlineAccessResponse;
      const { access_token, scope, ...rest } = responseBody;
      const sessionExpiration = new Date(
        Date.now() + responseBody.expires_in * 1000
      );
      currentSession.accessToken = access_token;
      currentSession.expires = sessionExpiration;
      currentSession.scope = scope;
      currentSession.onlineAccesInfo = rest;
    } else {
      const responseBody = postResponse.body as AccessTokenResponse;
      currentSession.accessToken = responseBody.access_token;
      currentSession.scope = responseBody.scope;
    }

    // If app is embedded or this is an offline session, we're no longer intereseted in the cookie
    cookies.set(ShopifyOAuth.SESSION_COOKIE_NAME, currentSession.id, {
      signed: true,
      expires: (Context.IS_EMBEDDED_APP || !currentSession.isOnline) ? new Date() : currentSession.expires,
      sameSite: 'none',
      secure: true,
    });

    // If this is an online session for an embedded app, we assume it will be loaded from a JWT from here on out
    if (Context.IS_EMBEDDED_APP && currentSession.isOnline) {
      const onlineInfo = currentSession.onlineAccesInfo as OnlineAccessInfo;
      const jwtSessionId = this.getJwtSessionId(currentSession.shop, ""+onlineInfo.associated_user.id);
      const jwtSession = Session.cloneSession(currentSession, jwtSessionId);
      await Context.deleteSession(currentSession.id);
      await Context.storeSession(jwtSession);
    }
    else {
      await Context.storeSession(currentSession);
    }
  },

  /**
   * Loads the current session id from the session cookie.
   *
   * @param request HTTP request object
   * @param response HTTP response object
   */
  getCookieSessionId(request: http.IncomingMessage, response: http.ServerResponse): string | undefined {
    const cookies = new Cookies(request, response, {
      secure: true,
      keys: [Context.API_SECRET_KEY],
    });
    return cookies.get(this.SESSION_COOKIE_NAME, { signed: true });
  },

  /**
   * Builds a JWT session id from the current shop and user.
   *
   * @param shop Shopify shop domain
   * @param userId Current actor id
   */
  getJwtSessionId(shop: string, userId: string): string {
    return `${shop}_${userId}`;
  },

  /**
   * Builds an offline session id for the given shop.
   *
   * @param shop Shopify shop domain
   */
  getOfflineSessionId(shop: string): string {
    return `offline_${shop}`;
  },
};

/**
 * Uses the validation utils validateHmac, validateShop, and safeCompare to assess whether the callback is valid.
 *
 * @param query Current HTTP Request Query
 * @param session Current session
 */
function validQuery(query: AuthQuery, session: Session): boolean {
  return (
    utils.validateHmac(query) &&
    utils.validateShop(query.shop) &&
    utils.safeCompare(query.state, session.state as string)
  );
}

export { ShopifyOAuth };
