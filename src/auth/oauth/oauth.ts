import http from 'http';
import querystring from 'querystring';

import {v4 as uuidv4} from 'uuid';
import Cookies from 'cookies';

import {Context} from '../../context';
import nonce from '../../utils/nonce';
import validateHmac from '../../utils/hmac-validator';
import safeCompare from '../../utils/safe-compare';
import decodeSessionToken from '../../utils/decode-session-token';
import {Session} from '../session';
import {HttpClient} from '../../clients/http_client/http_client';
import {DataType, RequestReturn} from '../../clients/http_client/types';
import * as ShopifyErrors from '../../error';
import {SessionInterface} from '../session/types';
import {sanitizeShop} from '../../utils/shop-validator';

import {
  AuthQuery,
  AccessTokenResponse,
  OnlineAccessResponse,
  OnlineAccessInfo,
} from './types';

const ShopifyOAuth = {
  SESSION_COOKIE_NAME: 'shopify_app_session',
  STATE_COOKIE_NAME: 'shopify_app_state',

  /**
   * Initializes a session and cookie for the OAuth process, and returns the necessary authorization url.
   *
   * @param request Current HTTP Request
   * @param response Current HTTP Response
   * @param shop Shop url: {shop}.myshopify.com
   * @param redirect Redirect url for callback
   * @param isOnline Boolean value. If true, appends 'per-user' grant options to authorization url to receive online access token.
   *                 During final oauth request, will receive back the online access token and current online session information.
   *                 Defaults to online access.
   */
  async beginAuth(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    shop: string,
    redirectPath: string,
    isOnline = true,
  ): Promise<string> {
    Context.throwIfUninitialized();
    Context.throwIfPrivateApp('Cannot perform OAuth for private apps');
    const cleanShop = sanitizeShop(shop, true)!;

    const cookies = new Cookies(request, response, {
      keys: [Context.API_SECRET_KEY],
      secure: true,
    });

    const state = isOnline ? `online_${nonce()}` : `offline_${nonce()}`;

    cookies.set(ShopifyOAuth.STATE_COOKIE_NAME, state, {
      signed: true,
      expires: new Date(Date.now() + 60000),
      sameSite: 'lax',
      secure: true,
    });

    /* eslint-disable @typescript-eslint/naming-convention */
    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES.toString(),
      redirect_uri: `${Context.HOST_SCHEME}://${Context.HOST_NAME}${redirectPath}`,
      state,
      'grant_options[]': isOnline ? 'per-user' : '',
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    const queryString = querystring.stringify(query);

    return `https://${cleanShop}/admin/oauth/authorize?${queryString}`;
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
   * @param isOnline Boolean value. Defaults to true (online access).
   * @returns SessionInterface
   */
  async validateAuthCallback(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    query: AuthQuery,
  ): Promise<SessionInterface> {
    Context.throwIfUninitialized();
    Context.throwIfPrivateApp('Cannot perform OAuth for private apps');

    const cookies = new Cookies(request, response, {
      keys: [Context.API_SECRET_KEY],
      secure: true,
    });

    const stateFromCookie = getValueFromCookie(
      request,
      response,
      this.STATE_COOKIE_NAME,
    );
    if (!stateFromCookie) {
      throw new ShopifyErrors.CookieNotFound(
        `Cannot complete OAuth process. Could not find an OAuth cookie for shop url: ${query.shop}`,
      );
    }

    if (!validQuery(query, stateFromCookie)) {
      throw new ShopifyErrors.InvalidOAuthError('Invalid OAuth callback.');
    }

    const isOnline = stateFromCookie.startsWith('online_');

    /* eslint-disable @typescript-eslint/naming-convention */
    const body = {
      client_id: Context.API_KEY,
      client_secret: Context.API_SECRET_KEY,
      code: query.code,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    const postParams = {
      path: '/admin/oauth/access_token',
      type: DataType.JSON,
      data: body,
    };
    const cleanShop = sanitizeShop(query.shop, true)!;

    const client = new HttpClient(cleanShop);
    const postResponse = await client.post(postParams);

    const session: Session = createSession(
      postResponse,
      cleanShop,
      stateFromCookie,
      isOnline,
    );

    cookies.set(ShopifyOAuth.SESSION_COOKIE_NAME, session.id, {
      signed: true,
      expires: Context.IS_EMBEDDED_APP ? new Date() : session.expires,
      sameSite: 'lax',
      secure: true,
    });

    const sessionStored = await Context.SESSION_STORAGE.storeSession(session);
    if (!sessionStored) {
      throw new ShopifyErrors.SessionStorageError(
        'Session could not be saved. Please check your session storage functionality.',
      );
    }

    return session;
  },

  /**
   * Loads the current session id from the session cookie.
   *
   * @param request HTTP request object
   * @param response HTTP response object
   */
  getCookieSessionId(
    request: http.IncomingMessage,
    response: http.ServerResponse,
  ): string | undefined {
    return getValueFromCookie(request, response, this.SESSION_COOKIE_NAME);
  },

  /**
   * Builds a JWT session id from the current shop and user.
   *
   * @param shop Shopify shop domain
   * @param userId Current actor id
   */
  getJwtSessionId(shop: string, userId: string): string {
    return `${sanitizeShop(shop, true)}_${userId}`;
  },

  /**
   * Builds an offline session id for the given shop.
   *
   * @param shop Shopify shop domain
   */
  getOfflineSessionId(shop: string): string {
    return `offline_${sanitizeShop(shop, true)}`;
  },

  /**
   * Extracts the current session id from the request / response pair.
   *
   * @param request  HTTP request object
   * @param response HTTP response object
   * @param isOnline Whether to load online (default) or offline sessions (optional)
   */
  getCurrentSessionId(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    isOnline = true,
  ): string | undefined {
    let currentSessionId: string | undefined;

    if (Context.IS_EMBEDDED_APP) {
      const authHeader = request.headers.authorization;
      if (authHeader) {
        const matches = authHeader.match(/^Bearer (.+)$/);
        if (!matches) {
          throw new ShopifyErrors.MissingJwtTokenError(
            'Missing Bearer token in authorization header',
          );
        }

        const jwtPayload = decodeSessionToken(matches[1]);
        const shop = jwtPayload.dest.replace(/^https:\/\//, '');
        if (isOnline) {
          currentSessionId = this.getJwtSessionId(shop, jwtPayload.sub);
        } else {
          currentSessionId = this.getOfflineSessionId(shop);
        }
      }
    }

    // Non-embedded apps will always load sessions using cookies. However, we fall back to the cookie session for
    // embedded apps to allow apps to load their skeleton page after OAuth, so they can set up App Bridge and get a new
    // JWT.
    if (!currentSessionId) {
      // We still want to get the offline session id from the cookie to make sure it's validated
      currentSessionId = getValueFromCookie(
        request,
        response,
        this.SESSION_COOKIE_NAME,
      );
    }

    return currentSessionId;
  },
};

/**
 * Uses the validation utils validateHmac, and safeCompare to assess whether the callback is valid.
 *
 * @param query Current HTTP Request Query
 * @param stateFromCookie state value from the current cookie
 */
function validQuery(query: AuthQuery, stateFromCookie: string): boolean {
  return validateHmac(query) && safeCompare(query.state, stateFromCookie);
}

/**
 * Loads a given value from the cookie
 *
 * @param request HTTP request object
 * @param response HTTP response object
 * @param name Name of the cookie to load
 */
function getValueFromCookie(
  request: http.IncomingMessage,
  response: http.ServerResponse,
  name: string,
): string | undefined {
  const cookies = new Cookies(request, response, {
    secure: true,
    keys: [Context.API_SECRET_KEY],
  });
  return cookies.get(name, {signed: true});
}

/**
 * Creates a new session from the response from the access token request.
 *
 * @param postResponse Response from the access token request
 * @param shop Shop url: {shop}.myshopify.com
 * @param stateFromCookie State from the cookie received by the OAuth callback
 * @param isOnline Boolean indicating if the access token is for online access
 * @returns SessionInterface
 */
function createSession(
  postResponse: RequestReturn,
  shop: string,
  stateFromCookie: string,
  isOnline: boolean,
): SessionInterface {
  let session: Session;

  if (isOnline) {
    let sessionId: string;
    const responseBody = postResponse.body as OnlineAccessResponse;
    const {access_token, scope, ...rest} = responseBody; // eslint-disable-line @typescript-eslint/naming-convention
    const sessionExpiration = new Date(
      Date.now() + responseBody.expires_in * 1000,
    );

    if (Context.IS_EMBEDDED_APP) {
      sessionId = ShopifyOAuth.getJwtSessionId(
        shop,
        `${(rest as OnlineAccessInfo).associated_user.id}`,
      );
    } else {
      sessionId = uuidv4();
    }

    session = new Session(sessionId, shop, stateFromCookie, isOnline);
    session.accessToken = access_token;
    session.scope = scope;
    session.expires = sessionExpiration;
    session.onlineAccessInfo = rest;
  } else {
    const responseBody = postResponse.body as AccessTokenResponse;
    session = new Session(
      ShopifyOAuth.getOfflineSessionId(shop),
      shop,
      stateFromCookie,
      isOnline,
    );
    session.accessToken = responseBody.access_token;
    session.scope = responseBody.scope;
  }

  return session;
}

export {ShopifyOAuth};
