import http from 'http';
import http2 from 'http2';
import querystring from 'querystring';

import {v4 as uuidv4} from 'uuid';
import cookie from 'cookie';

import {Context} from '../../context';
import nonce from '../../utils/nonce';
import validateHmac from '../../utils/hmac-validator';
import safeCompare from '../../utils/safe-compare';
import decodeSessionToken from '../../utils/decode-session-token';
import {Session} from '../session';
import {HttpClient} from '../../clients/http_client/http_client';
import {DataType} from '../../clients/http_client/types';
import * as ShopifyErrors from '../../error';
import {SessionInterface} from '../session/types';

import {
  AuthQuery,
  AccessTokenResponse,
  OnlineAccessResponse,
  OnlineAccessInfo,
} from './types';

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
   *                 Defaults to online access.
   */
  async beginAuth(
    request: http.IncomingMessage | http2.Http2ServerRequest,
    response: http.ServerResponse | http2.Http2ServerResponse,
    shop: string,
    redirectPath: string,
    isOnline = true,
  ): Promise<string> {
    Context.throwIfUninitialized();
    Context.throwIfPrivateApp('Cannot perform OAuth for private apps');

    const state = nonce();

    const session = new Session(
      isOnline ? uuidv4() : this.getOfflineSessionId(shop),
      shop,
      state,
      isOnline,
    );

    const sessionStored = await Context.SESSION_STORAGE.storeSession(session);

    if (!sessionStored) {
      throw new ShopifyErrors.SessionStorageError(
        'OAuth Session could not be saved. Please check your session storage functionality.',
      );
    }

    this.setCookieSessionId(
      request,
      response,
      session.id,
      new Date(Date.now() + 60000),
    );

    /* eslint-disable @typescript-eslint/naming-convention */
    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES.toString(),
      redirect_uri: `https://${Context.HOST_NAME}${redirectPath}`,
      state,
      'grant_options[]': isOnline ? 'per-user' : '',
    };
    /* eslint-enable @typescript-eslint/naming-convention */

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
   * @returns SessionInterface
   */
  async validateAuthCallback(
    request: http.IncomingMessage | http2.Http2ServerRequest,
    response: http.ServerResponse | http2.Http2ServerResponse,
    query: AuthQuery,
  ): Promise<SessionInterface> {
    Context.throwIfUninitialized();
    Context.throwIfPrivateApp('Cannot perform OAuth for private apps');

    const sessionCookie = this.getCookieSessionId(request, response);
    if (!sessionCookie) {
      throw new ShopifyErrors.CookieNotFound(
        `Cannot complete OAuth process. Could not find an OAuth cookie for shop url: ${query.shop}`,
      );
    }

    let currentSession = await Context.SESSION_STORAGE.loadSession(
      sessionCookie,
    );
    if (!currentSession) {
      throw new ShopifyErrors.SessionNotFound(
        `Cannot complete OAuth process. No session found for the specified shop url: ${query.shop}`,
      );
    }

    if (!validQuery(query, currentSession)) {
      throw new ShopifyErrors.InvalidOAuthError('Invalid OAuth callback.');
    }

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

    const client = new HttpClient(currentSession.shop);
    const postResponse = await client.post(postParams);

    if (currentSession.isOnline) {
      const responseBody = postResponse.body as OnlineAccessResponse;
      const {access_token, scope, ...rest} = responseBody; // eslint-disable-line @typescript-eslint/naming-convention
      const sessionExpiration = new Date(
        Date.now() + responseBody.expires_in * 1000,
      );
      currentSession.accessToken = access_token;
      currentSession.expires = sessionExpiration;
      currentSession.scope = scope;
      currentSession.onlineAccessInfo = rest;

      // For an online session in an embedded app, we no longer want the cookie session so we delete it
      if (Context.IS_EMBEDDED_APP) {
        // If this is an online session for an embedded app, replace the online session with a JWT session
        const onlineInfo = currentSession.onlineAccessInfo as OnlineAccessInfo;
        const jwtSessionId = this.getJwtSessionId(
          currentSession.shop,
          `${onlineInfo.associated_user.id}`,
        );
        const jwtSession = Session.cloneSession(currentSession, jwtSessionId);

        const sessionDeleted = await Context.SESSION_STORAGE.deleteSession(
          currentSession.id,
        );
        if (!sessionDeleted) {
          throw new ShopifyErrors.SessionStorageError(
            'OAuth Session could not be deleted. Please check your session storage functionality.',
          );
        }
        currentSession = jwtSession;
      }
    } else {
      // Offline sessions (embedded / non-embedded) will use the same id so they don't need to be updated
      const responseBody = postResponse.body as AccessTokenResponse;
      currentSession.accessToken = responseBody.access_token;
      currentSession.scope = responseBody.scope;
    }

    this.setCookieSessionId(
      request,
      response,
      currentSession.id,
      Context.IS_EMBEDDED_APP ? new Date() : currentSession.expires,
    );

    const sessionStored = await Context.SESSION_STORAGE.storeSession(
      currentSession,
    );
    if (!sessionStored) {
      throw new ShopifyErrors.SessionStorageError(
        'OAuth Session could not be saved. Please check your session storage functionality.',
      );
    }

    return currentSession;
  },

  /**
   * Loads the current session id from the session cookie.
   *
   * @param request HTTP request object
   * @param response HTTP response object
   */
  getCookieSessionId(
    request: http.IncomingMessage | http2.Http2ServerRequest,
    // @ts-ignore unused variable
    response: http.ServerResponse | http2.Http2ServerResponse,
  ): string | undefined {
    try {
      return cookie.parse(request.headers.cookie ?? '')[
        ShopifyOAuth.SESSION_COOKIE_NAME
      ];
    } catch (error) {
      return undefined;
    }
  },

  /**
   * Sets the session id to the session cookie.
   *
   * @param request HTTP request object
   * @param response HTTP response object
   */
  setCookieSessionId(
    // @ts-ignore unused variable
    request: http.IncomingMessage | http2.Http2ServerRequest,
    response: http.ServerResponse | http2.Http2ServerResponse,
    sessionId: string,
    expires?: Date,
  ) {
    response.setHeader(
      'Set-Cookie',
      cookie.serialize(ShopifyOAuth.SESSION_COOKIE_NAME, sessionId, {
        secure: true,
        httpOnly: true,
        expires,
      }),
    );
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

  /**
   * Extracts the current session id from the request / response pair.
   *
   * @param request  HTTP request object
   * @param response HTTP response object
   * @param isOnline Whether to load online (default) or offline sessions (optional)
   */
  getCurrentSessionId(
    request: http.IncomingMessage | http2.Http2ServerRequest,
    response: http.ServerResponse | http2.Http2ServerResponse,
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
      currentSessionId = this.getCookieSessionId(request, response);
    }

    return currentSessionId;
  },
};

/**
 * Uses the validation utils validateHmac, and safeCompare to assess whether the callback is valid.
 *
 * @param query Current HTTP Request Query
 * @param session Current session
 */
function validQuery(query: AuthQuery, session: Session): boolean {
  return (
    validateHmac(query) && safeCompare(query.state, session.state as string)
  );
}

export {ShopifyOAuth};
