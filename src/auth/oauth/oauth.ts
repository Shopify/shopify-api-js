import {Request, Response, OutgoingCookieJar, getHeader, IncomingCookieJar} from '../../runtime/http';

import {crypto} from '../../runtime/crypto';
import {Context} from '../../context';
import nonce from '../../utils/nonce';
import validateHmac from '../../utils/hmac-validator';
import validateShop from '../../utils/shop-validator';
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

export interface BeginAuthOptions {
  isOnline: boolean;
  shop?: string;
}

export interface BeginAuthReturn {
  redirectUrl: string;
  sessionCookies: string[];
}

const defaultBeginAuthOptions: BeginAuthOptions = {
  isOnline: true
}

const ShopifyOAuth = {
  SESSION_COOKIE_NAME: 'shopify_app_session',

  /**
   * Initializes a session and cookie for the OAuth process, and returns the
   * necessary authorization url.
   *
   * @param request Current HTTP Request
   * @param shop Shop url: {shop}.myshopify.com
   * @param redirectPath Redirect url for callback
   * @param options Options object
   * @param options.isOnline Boolean value. If true, appends 'per-user' grant
   *                         options to authorization url to receive online
   *                         access token. During final oauth request, will
   *                         receive back the online access token and current
   *                         online session information. Defaults to online
   *                         access.
   * @param options.shop Shop url: {shop}.myshopify.com
   */
  async beginAuth(
    request: Request,
    redirectPath: string,
    options: Partial<BeginAuthOptions> = {}
  ): Promise<BeginAuthReturn> {
    Context.throwIfUninitialized();
    Context.throwIfPrivateApp('Cannot perform OAuth for private apps');

    let {shop, isOnline} = {...defaultBeginAuthOptions, ...options};
    if(!shop) {
      shop = new URL(request.url).searchParams.get("url") ?? undefined;
    }
    if(!shop) {
      throw new ShopifyErrors.HttpRequestError("No shop value");
    }

    const cookies = new OutgoingCookieJar([Context.API_SECRET_KEY]);

    const state = nonce();

    const sessionId =
      isOnline ? uuidv4() : this.getOfflineSessionId(shop);
    const session = new Session(
      sessionId,
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

    await cookies.setAndSign(ShopifyOAuth.SESSION_COOKIE_NAME, session.id, {
      expires: new Date(Date.now() + 60000),
      sameSite: 'lax',
      secure: true,
    });

    /* eslint-disable @typescript-eslint/naming-convention */
    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES.toString(),
      redirect_uri: `https://${Context.HOST_NAME}${redirectPath}`,
      state,
      'grant_options[]': isOnline ? 'per-user' : '',
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    // const queryString = querystring.stringify(query);
    const queryString = new URLSearchParams(query).toString();

    return {
      redirectUrl: `https://${shop}/admin/oauth/authorize?${queryString}`,
      sessionCookies: cookies.toHeaders(),
    };
  },

  /**
   * Validates the received callback query.
   * If valid, will make the subsequent request to update the current session with the appropriate access token.
   * Throws errors for missing sessions and invalid callbacks.
   *
   * @param request Current HTTP Request
   * @returns SessionInterface
   */
  async validateAuthCallback(
    request: Request,
  ): Promise<SessionInterface> {
    Context.throwIfUninitialized();
    Context.throwIfPrivateApp('Cannot perform OAuth for private apps');

    const query = Object.fromEntries(new URL(request.url, "https://example.com").searchParams.entries()) as unknown as AuthQuery;
    const sessionCookie = await this.getCookieSessionId(request);
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

    if (!(await validQuery(query, currentSession))) {
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
   */
  getCookieSessionId(request: Request): Promise<string | undefined> {
    const cookies = IncomingCookieJar.fromRequest(request, [Context.API_SECRET_KEY]);
    return cookies.getAndVerify(this.SESSION_COOKIE_NAME);
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
   * @param isOnline Whether to load online (default) or offline sessions (optional)
   */
  async getCurrentSessionId(
    request: Request,
    isOnline = true,
  ): Promise<string | undefined> {
    let currentSessionId: string | undefined;

    if (Context.IS_EMBEDDED_APP) {
      const authHeader = getHeader(request.headers, 'Authorization');
      if (authHeader) {
        const matches = authHeader.match(/^Bearer (.+)$/);
        if (!matches) {
          throw new ShopifyErrors.MissingJwtTokenError(
            'Missing Bearer token in authorization header',
          );
        }

        const jwtPayload = await decodeSessionToken(matches[1]);
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
      currentSessionId = await this.getCookieSessionId(request);
    }

    return currentSessionId;
  },
};

/**
 * Uses the validation utils validateHmac, validateShop, and safeCompare to assess whether the callback is valid.
 *
 * @param query Current HTTP Request Query
 * @param session Current session
 */
async function validQuery(
  query: AuthQuery,
  session: Session,
): Promise<boolean> {
  return (
    (await validateHmac(query)) &&
    validateShop(query.shop) &&
    safeCompare(query.state, session.state as string)
  );
}

export {ShopifyOAuth};

function uuidv4() {
  return crypto.randomUUID();
}
