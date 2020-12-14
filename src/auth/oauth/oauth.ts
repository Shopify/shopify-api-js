import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import Cookies from 'cookies';
import { Context } from '../../context';
import utils from '../../utils';
import querystring from 'querystring';
import { AuthQuery, AccessTokenResponse, OnlineAccessResponse } from '../types';
import { Session } from '../session';
import { DataType, HttpClient } from '../../clients/http_client';
import * as ShopifyErrors from '../../error';

const ShopifyOAuth = {
  SESSION_COOKIE_NAME: 'shopify_app_session',

  /**
   * Initializes a session and cookie for the OAuth process, and returns the necessary authorization url.
   * 
   * @param request Request object
   * @param response Response object
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
    redirect: string,
    isOnline = false
  ): Promise<string> {
    Context.throwIfUnitialized();

    const cookies = new Cookies(request, response, {
      keys: [Context.API_SECRET_KEY],
      secure: true,
    });

    const state = utils.nonce();

    const session = new Session(isOnline ? uuidv4() : shop + '_offline');
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
      redirect_uri: redirect,
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
   * @param request Request object
   * @param response Response object
   * @param query Request query object, containing the information to be validated.
   *              Depending on framework, this may need to be cast as "unknown" before being passed. 
   */
  async validateAuthCallback(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    query: AuthQuery
  ): Promise<void> {
    Context.throwIfUnitialized();

    const cookies = new Cookies(request, response, {
      keys: [Context.API_SECRET_KEY],
      secure: true,
    });

    const currentSession = await utils.loadCurrentSession(request, response, true);

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

      cookies.set(ShopifyOAuth.SESSION_COOKIE_NAME, currentSession.id, {
        signed: true,
        domain: Context.HOST_NAME,
        expires: sessionExpiration,
        sameSite: 'none',
        secure: true,
      });
    } else {
      const responseBody = postResponse.body as AccessTokenResponse;
      currentSession.accessToken = responseBody.access_token;
      currentSession.scope = responseBody.scope;
    }

    await Context.storeSession(currentSession);
  },
};

/**
 * Uses the validation utils validateHmac, validateShop, and safeCompare to assess whether the callback is valid.
 * 
 * @param query Request query object
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
