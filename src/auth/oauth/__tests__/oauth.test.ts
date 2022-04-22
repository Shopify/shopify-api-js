import querystring from 'querystring';

import {
  setAbstractFetchFunc,
  Request,
  Response,
  getHeaders,
  IncomingCookieJar,
  setHeader,
} from '../../../runtime/http';
import Shopify from '../../../adapters/node';
import * as mockAdapter from '../../../adapters/mock';
import {ShopifyOAuth} from '../oauth';
import {Context} from '../../../context';
// import * as Shopify.Errors from '../../../error';
import {AuthQuery} from '../types';
import {generateLocalHmac} from '../../../utils/hmac-validator';
import {JwtPayload} from '../../../utils/decode-session-token';
import loadCurrentSession from '../../../utils/load-current-session';
import {CustomSessionStorage, Session} from '../../session';
import {signJWT} from '../../../utils/setup-jest';

setAbstractFetchFunc(mockAdapter.abstractFetch);
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    /* eslint-disable @typescript-eslint/naming-convention */
    interface Matchers<R> {
      toBeWithinSecondsOf(compareDate: number, seconds: number): R;
    }
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}

let shop: string;

beforeEach(() => {
  shop = 'someshop.myshopify.io';
});

describe('beginAuth', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    // Reset
    req = {} as Request;
    res = {} as Response;
  });

  test('throws Context error when not properly initialized', async () => {
    Context.API_KEY = '';

    await expect(
      ShopifyOAuth.beginAuth(req, '/some-callback', {shop}),
    ).rejects.toThrow(Shopify.Errors.UninitializedContextError);
  });

  test('throws SessionStorageErrors when storeSession returns false', async () => {
    const storage = new CustomSessionStorage(
      () => Promise.resolve(false),
      () => Promise.resolve(new Session('id', shop, 'state', true)),
      () => Promise.resolve(true),
    );
    Context.SESSION_STORAGE = storage;

    await expect(
      ShopifyOAuth.beginAuth(req, 'some-callback', {shop}),
    ).rejects.toThrow(Shopify.Errors.SessionStorageError);
  });

  test('creates and stores a new session for the specified shop', async () => {
    const {redirectUrl, sessionCookies} = await ShopifyOAuth.beginAuth(
      req,
      '/some-callback',
      {shop}
    );
    const cookieJar = new IncomingCookieJar(sessionCookies);
    const sessionId = cookieJar.get(Shopify.Auth.SESSION_COOKIE_NAME);

    const session = await Context.SESSION_STORAGE.loadSession(
      sessionId
    );

    expect(redirectUrl).toBeDefined();
    expect(session).toBeDefined();
    expect(session).toHaveProperty('id');
    expect(session).toHaveProperty('shop', shop);
    expect(session).toHaveProperty('state');
    expect(session).toHaveProperty('expires', undefined);
  });

  test('sets session id and cookie to shop name prefixed with "offline_" for offline access requests', async () => {
    const {sessionCookies} = await ShopifyOAuth.beginAuth(req,'/some-callback', {shop, isOnline: false});
    const cookieJar = new IncomingCookieJar(sessionCookies);
    const sessionId = cookieJar.get(Shopify.Auth.SESSION_COOKIE_NAME);
    expect(sessionId).toBe(`offline_${shop}`);
  });

  test('returns the correct auth url for given info', async () => {
    const {redirectUrl, sessionCookies} = await ShopifyOAuth.beginAuth(
      req,
      '/some-callback',
      {shop, isOnline: false}
    );
    const cookieJar = new IncomingCookieJar(sessionCookies);
    const sessionId = cookieJar.get(Shopify.Auth.SESSION_COOKIE_NAME);
    const session = await Context.SESSION_STORAGE.loadSession(
      sessionId
    );
    /* eslint-disable @typescript-eslint/naming-convention */
    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES.toString(),
      redirect_uri: `https://${Context.HOST_NAME}/some-callback`,
      state: session ? session.state : '',
      'grant_options[]': '',
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    const expectedQueryString = querystring.stringify(query);

    expect(redirectUrl).toBe(
      `https://${shop}/admin/oauth/authorize?${expectedQueryString}`,
    );
  });

  test('appends per_user access mode to url when isOnline is set to true', async () => {
    const {redirectUrl, sessionCookies} = await ShopifyOAuth.beginAuth(
      req,
      '/some-callback',
      {shop}
    );
    const cookieJar = new IncomingCookieJar(sessionCookies);
    const sessionId = cookieJar.get(Shopify.Auth.SESSION_COOKIE_NAME);
    const session = await Context.SESSION_STORAGE.loadSession(
      sessionId
    );

    /* eslint-disable @typescript-eslint/naming-convention */
    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES.toString(),
      redirect_uri: `https://${Context.HOST_NAME}/some-callback`,
      state: session ? session.state : '',
      'grant_options[]': 'per-user',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const expectedQueryString = querystring.stringify(query);

    expect(redirectUrl).toBe(
      `https://${shop}/admin/oauth/authorize?${expectedQueryString}`,
    );
  });

  test('fails to start if the app is private', () => {
    Context.IS_PRIVATE_APP = true;
    Context.initialize(Context);

    expect(
      ShopifyOAuth.beginAuth(req, '/some-callback', {shop}),
    ).rejects.toThrow(Shopify.Errors.PrivateAppError);
  });
});

describe('validateAuthCallback', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
    req = {} as Request;
    res = {} as Response;
  });

  test('throws Context error when not properly initialized', async () => {
    Context.API_KEY = '';
    const session = await Context.SESSION_STORAGE.loadSession(
      undefined as any
    );
    const testCallbackQuery: AuthQuery = {
      shop,
      state: session ? session.state : '',
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    req = {
      method: "GET",
      url: `/?${new URLSearchParams(testCallbackQuery as any).toString()}`,
      headers: {}
    }

    await expect(
      ShopifyOAuth.validateAuthCallback(req)
    ).rejects.toThrow(Shopify.Errors.UninitializedContextError);
  });

  test("throws an error when receiving a callback for a shop that doesn't have a session cookie", async () => {
    await expect(
      ShopifyOAuth.validateAuthCallback(req),
    ).rejects.toThrow(Shopify.Errors.CookieNotFound);
  });

  test('throws an error when receiving a callback for a shop with no saved session', async () => {
    const {sessionCookies} = await ShopifyOAuth.beginAuth(req, '/some-callback', {shop: 'invalidurl.com'});
    const cookieJar = new IncomingCookieJar(sessionCookies);
    const sessionId = cookieJar.get(Shopify.Auth.SESSION_COOKIE_NAME);

    await Context.SESSION_STORAGE.deleteSession(sessionId);

    req = {
      method: "GET",
      path:
    }
    copySessionCookieToRequest(req, res);
    await expect(
      ShopifyOAuth.validateAuthCallback(req, {
        shop: 'I do not exist',
      } as AuthQuery),
    ).rejects.toThrow(Shopify.Errors.SessionNotFound);
  });

  test('throws error when callback includes invalid hmac, or state', async () => {
    await ShopifyOAuth.beginAuth(req, '/some-callback', {shop: 'invalidurl.com'});
    const testCallbackQuery: AuthQuery = {
      shop: 'invalidurl.com',
      state: 'incorrect',
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    testCallbackQuery.hmac = 'definitely the wrong hmac';

    copySessionCookieToRequest(req, res);
    await expect(
      ShopifyOAuth.validateAuthCallback(req, testCallbackQuery),
    ).rejects.toThrow(Shopify.Errors.InvalidOAuthError);
  });

  test('throws a SessionStorageError when storeSession returns false', async () => {
    await ShopifyOAuth.beginAuth(req, '/some-callback', {shop});
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );

    const testCallbackQuery: AuthQuery = {
      shop,
      state: session ? session.state : '',
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    /* eslint-disable @typescript-eslint/naming-convention */
    const successResponse = {
      access_token: 'some access token string',
      scope: Context.SCOPES.toString(),
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    mockAdapter.queueResponse(
      buildMockResponse(JSON.stringify(successResponse)),
    );

    // create new storage with broken storeCallback for validateAuthCallback to use
    Context.SESSION_STORAGE = new CustomSessionStorage(
      () => Promise.resolve(false),
      () => Promise.resolve(session),
      () => Promise.resolve(true),
    );

    copySessionCookieToRequest(req, res);
    await expect(
      ShopifyOAuth.validateAuthCallback(req, testCallbackQuery),
    ).rejects.toThrow(Shopify.Errors.SessionStorageError);
  });

  test('requests access token for valid callbacks with offline access and updates session', async () => {
    await ShopifyOAuth.beginAuth(req, '/some-callback', {shop});
    let session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
    const testCallbackQuery: AuthQuery = {
      shop,
      state: session ? session.state : '',
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    /* eslint-disable @typescript-eslint/naming-convention */
    const successResponse = {
      access_token: 'some access token string',
      scope: Context.SCOPES.toString(),
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    mockAdapter.queueResponse(
      buildMockResponse(JSON.stringify(successResponse)),
    );
    copySessionCookieToRequest(req, res);
    await ShopifyOAuth.validateAuthCallback(req, testCallbackQuery);
    session = await Context.SESSION_STORAGE.loadSession(currentSessionId(res));

    expect(session?.accessToken).toBe(successResponse.access_token);
  });

  test('requests access token for valid callbacks with online access and updates session with expiration and onlineAccessInfo', async () => {
    await ShopifyOAuth.beginAuth(req,'/some-callback', {shop});
    let session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
    const testCallbackQuery: AuthQuery = {
      shop,
      state: session ? session.state : '',
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    /* eslint-disable @typescript-eslint/naming-convention */
    const successResponse = {
      access_token: 'some access token',
      scope: 'pet_kitties, walk_dogs',
      expires_in: '525600',
      associated_user_scope: 'pet_kitties',
      associated_user: {
        id: '8675309',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john@example.com',
        email_verified: true,
        account_owner: true,
        locale: 'en',
        collaborator: true,
      },
    };

    const expectedOnlineAccessInfo = {
      expires_in: successResponse.expires_in,
      associated_user_scope: successResponse.associated_user_scope,
      associated_user: successResponse.associated_user,
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    mockAdapter.queueResponse(
      buildMockResponse(JSON.stringify(successResponse)),
    );
    copySessionCookieToRequest(req, res);
    await ShopifyOAuth.validateAuthCallback(req, testCallbackQuery);
    session = await Context.SESSION_STORAGE.loadSession(currentSessionId(res));

    expect(session?.accessToken).toBe(successResponse.access_token);
    expect(session?.expires).toBeInstanceOf(Date);
    expect(session?.onlineAccessInfo).toEqual(expectedOnlineAccessInfo);
  });

  test('fails to run if the app is private', () => {
    Context.IS_PRIVATE_APP = true;
    Context.initialize(Context);

    expect(
      ShopifyOAuth.validateAuthCallback(req, {} as AuthQuery),
    ).rejects.toThrow(Shopify.Errors.PrivateAppError);
  });

  test('properly updates the Oauth cookie for online, embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    await ShopifyOAuth.beginAuth(req,  '/some-callback', {shop});
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
    expect(session).not.toBe(null);

    /* eslint-disable @typescript-eslint/naming-convention */
    const successResponse = {
      access_token: 'some access token',
      scope: 'pet_kitties, walk_dogs',
      expires_in: 525600,
      associated_user_scope: 'pet_kitties',
      associated_user: {
        id: '1',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john@example.com',
        email_verified: true,
        account_owner: true,
        locale: 'en',
        collaborator: true,
      },
    };
    const testCallbackQuery: AuthQuery = {
      shop,
      state: session ? session.state : '',
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const expectedHmac = await generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    mockAdapter.queueResponse(
      buildMockResponse(JSON.stringify(successResponse)),
    );
    copySessionCookieToRequest(req, res);
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
      testCallbackQuery,
    );

    const jwtPayload: JwtPayload = {
      iss: `https://${shop}/admin`,
      dest: `https://${shop}`,
      aud: Context.API_KEY,
      sub: '1',
      exp:
        new Date(Date.now() + successResponse.expires_in * 1000).getTime() /
        1000,
      nbf: 1234,
      iat: 1234,
      jti: '4321',
      sid: 'abc123',
    };

    const jwtSessionId = `${shop}_${jwtPayload.sub}`;
    const actualJwtSession = await Context.SESSION_STORAGE.loadSession(
      jwtSessionId,
    );
    expect(actualJwtSession).not.toBeUndefined();
    expect(actualJwtSession).toEqual(returnedSession);
    const actualJwtExpiration = actualJwtSession?.expires
      ? actualJwtSession.expires.getTime() / 1000
      : 0;
    expect(actualJwtExpiration).toBeWithinSecondsOf(jwtPayload.exp, 1);

    // Simulate a subsequent JWT request to see if the session is loaded as the current one

    const token = await signJWT(jwtPayload);
    const jwtReq = {
      method: 'GET',
      url: `https://${shop}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;

    const currentSession = await loadCurrentSession(jwtReq);
    expect(currentSession).not.toBe(null);
    expect(currentSession?.id).toEqual(jwtSessionId);
    const jar = currentCookieJar(res);
    const sessionCookie = jar[Shopify.Auth.SESSION_COOKIE_NAME];
    expect(sessionCookie?.expires?.getTime() as number).toBeWithinSecondsOf(
      new Date().getTime(),
      1,
    );
  });

  test('properly updates the Oauth cookie for online, non-embedded apps', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    await ShopifyOAuth.beginAuth(req, '/some-callback', {shop});
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );

    /* eslint-disable @typescript-eslint/naming-convention */
    const successResponse = {
      access_token: 'some access token',
      scope: 'pet_kitties, walk_dogs',
      expires_in: 525600,
      associated_user_scope: 'pet_kitties',
      associated_user: {
        id: '1',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john@example.com',
        email_verified: true,
        account_owner: true,
        locale: 'en',
        collaborator: true,
      },
    };
    const testCallbackQuery: AuthQuery = {
      shop,
      state: session ? session.state : '',
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const expectedHmac = await generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    mockAdapter.queueResponse(
      buildMockResponse(JSON.stringify(successResponse)),
    );
    copySessionCookieToRequest(req, res);
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
      testCallbackQuery,
    );
    expect(returnedSession.id).toEqual(currentSessionId(res));

    expect(returnedSession?.expires?.getTime() as number).toBeWithinSecondsOf(
      new Date(Date.now() + successResponse.expires_in * 1000).getTime(),
      1,
    );
    const jar = currentCookieJar(res);
    const sessionCookie = jar[Shopify.Auth.SESSION_COOKIE_NAME];
    expect(sessionCookie?.expires?.getTime() as number).toBeWithinSecondsOf(
      returnedSession?.expires?.getTime() as number,
      1,
    );

    const cookieSession = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
    expect(cookieSession).not.toBeUndefined();
  });

  test('properly updates the Oauth cookie for offline, embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const {sessionCookies} = await ShopifyOAuth.beginAuth(req, '/some-callback', {shop, isOnline: false});
    const cookieJar = new IncomingCookieJar(sessionCookies);
    const sessionId = cookieJar.get(Shopify.Auth.SESSION_COOKIE_NAME);

    const session = await Context.SESSION_STORAGE.loadSession(
      sessionId
    );

    /* eslint-disable @typescript-eslint/naming-convention */
    const successResponse = {
      access_token: 'some access token',
      scope: 'pet_kitties, walk_dogs',
      expires_in: 525600,
      associated_user_scope: 'pet_kitties',
      associated_user: {
        id: '1',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john@example.com',
        email_verified: true,
        account_owner: true,
        locale: 'en',
        collaborator: true,
      },
    };
    const testCallbackQuery: AuthQuery = {
      shop,
      state: session ? session.state : '',
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const expectedHmac = await generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    mockAdapter.queueResponse(
      buildMockResponse(JSON.stringify(successResponse)),
    );
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
      testCallbackQuery,
    );
    expect(returnedSession.id).toEqual(currentSessionId(res));
    expect(returnedSession.id).toEqual(ShopifyOAuth.getOfflineSessionId(shop));

    const cookieSession = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
    expect(cookieSession).not.toBeUndefined();
    const jar = currentCookieJar(res);
    const sessionCookie = jar[Shopify.Auth.SESSION_COOKIE_NAME];
    expect(sessionCookie?.expires?.getTime() as number).toBeWithinSecondsOf(
      new Date().getTime(),
      1,
    );
    expect(returnedSession?.expires?.getTime()).toBeUndefined();
  });

  test('properly updates the Oauth cookie for offline, non-embedded apps', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const {sessionCookies} = await ShopifyOAuth.beginAuth(req, '/some-callback', {shop, isOnline: false});
    const cookieJar = new IncomingCookieJar(sessionCookies);
    const sessionId = cookieJar.get(Shopify.Auth.SESSION_COOKIE_NAME);
    const session = await Context.SESSION_STORAGE.loadSession(
      sessionId
    );

    /* eslint-disable @typescript-eslint/naming-convention */
    const successResponse = {
      access_token: 'some access token',
      scope: 'pet_kitties, walk_dogs',
      expires_in: 525600,
      associated_user_scope: 'pet_kitties',
      associated_user: {
        id: '1',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john@example.com',
        email_verified: true,
        account_owner: true,
        locale: 'en',
        collaborator: true,
      },
    };
    const testCallbackQuery: AuthQuery = {
      shop,
      state: session ? session.state : '',
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const expectedHmac = await generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    mockAdapter.queueResponse(
      buildMockResponse(JSON.stringify(successResponse)),
    );
    req = {
      method: "GET",
      url: `/some-callback?${new URLSearchParams(testCallbackQuery as any).toString()}`,
      headers: {
        Cookie: cookieJar.entries().map(([key, value]) => `${key}=${value}`).join(";")
      }
    }
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
    );
    expect(returnedSession.id).toEqual(sessionId);
    expect(returnedSession.id).toEqual(ShopifyOAuth.getOfflineSessionId(shop));
    expect(returnedSession?.expires?.getTime()).toBeUndefined();

    const cookieSession = await Context.SESSION_STORAGE.loadSession(
      sessionId
    );
    expect(cookieSession).not.toBeUndefined();
  });
});

function buildMockResponse(body: string): Response {
  return {
    statusCode: 200,
    statusText: 'OK',
    headers: {},
    body,
  };
}

// function currentCookieJar(res: Response): CookieJar {
//   return Cookies.parseCookies(getHeaders(res.headers, 'Set-Cookie') ?? []);
// }

// function currentSessionId(res: Response): string {
//   const jar = currentCookieJar(res);
//   return jar[Shopify.Auth.SESSION_COOKIE_NAME]?.value;
// }

// function copySessionCookieToRequest(req: Request, res: Response) {
//   if (!req.headers) req.headers = {};
//   const responseJar = Cookies.parseCookies(
//     getHeaders(res.headers, 'Set-Cookie'),
//   );
//   const sessionCookieName = Shopify.Auth.SESSION_COOKIE_NAME;
//   if (responseJar[sessionCookieName]) {
//     req.headers.Cookie = `${sessionCookieName}=${responseJar[sessionCookieName].value}`;
//     const sigName = `${sessionCookieName}.sig`;
//     if (responseJar[sigName]) {
//       req.headers.Cookie += `,${sigName}=${responseJar[sigName].value}`;
//     }
//   }
// }

function buildAuthCallbackRequest(qry: Partial<AuthQuery>,