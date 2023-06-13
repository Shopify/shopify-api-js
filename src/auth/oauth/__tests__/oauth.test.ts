import querystring from 'querystring';

import jwt from 'jsonwebtoken';

import {
  setAbstractFetchFunc,
  Request,
  Response,
  Cookies,
  CookieJar,
  getHeaders,
} from '../../../adapters/abstract-http';
import Shopify from '../../../index-node';
import * as mockAdapter from '../../../adapters/mock-adapter';
import {ShopifyOAuth} from '../oauth';
import {Context} from '../../../context';
<<<<<<< HEAD
import nonce from '../../../utils/nonce';
import * as ShopifyErrors from '../../../error';
=======
// import * as Shopify.Errors from '../../../error';
>>>>>>> origin/isomorphic/crypto
import {AuthQuery} from '../types';
import {generateLocalHmac} from '../../../utils/hmac-validator';
import {JwtPayload} from '../../../utils/decode-session-token';
import loadCurrentSession from '../../../utils/load-current-session';
import {CustomSessionStorage} from '../../session';

const VALID_NONCE = 'noncenoncenonce';

<<<<<<< HEAD
jest.mock('cookies');
jest.mock('../../../utils/nonce', () => jest.fn(() => VALID_NONCE));
=======
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
>>>>>>> origin/isomorphic/crypto

let shop: string;

beforeEach(() => {
  shop = 'someshop.myshopify.io';
});

describe('beginAuth', () => {
  let req: Request;
  let res: Response;

  beforeEach(() => {
<<<<<<< HEAD
    cookies = {
      id: '',
    };

    req = {} as http.IncomingMessage;
    res = {} as http.ServerResponse;

    Cookies.prototype.set.mockImplementation(
      (cookieName: string, cookieValue: string) => {
        expect(cookieName).toBe('shopify_app_state');
        cookies.id = cookieValue;
      },
    );
=======
    // Reset
    req = {} as Request;
    res = {} as Response;
>>>>>>> origin/isomorphic/crypto
  });

  test('throws Context error when not properly initialized', async () => {
    Context.API_KEY = '';

    await expect(
      ShopifyOAuth.beginAuth(req, res, shop, '/some-callback'),
    ).rejects.toThrow(Shopify.Errors.UninitializedContextError);
  });

<<<<<<< HEAD
  test('sets cookie to state for offline access requests', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', false);

    expect(nonce).toHaveBeenCalled();
    expect(cookies.id).toBe(`offline_${VALID_NONCE}`);
  });

  test('sets cookie to state for online access requests', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true);

    expect(nonce).toHaveBeenCalled();
    expect(cookies.id).toBe(`online_${VALID_NONCE}`);
=======
  test('throws SessionStorageErrors when storeSession returns false', async () => {
    const storage = new CustomSessionStorage(
      () => Promise.resolve(false),
      () => Promise.resolve(new Session('id', shop, 'state', true)),
      () => Promise.resolve(true),
    );
    Context.SESSION_STORAGE = storage;

    await expect(
      ShopifyOAuth.beginAuth(req, res, shop, 'some-callback'),
    ).rejects.toThrow(Shopify.Errors.SessionStorageError);
  });

  test('creates and stores a new session for the specified shop', async () => {
    const authRoute = await ShopifyOAuth.beginAuth(
      req,
      res,
      shop,
      '/some-callback',
    );
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );

    expect(authRoute).toBeDefined();
    expect(session).toBeDefined();
    expect(session).toHaveProperty('id');
    expect(session).toHaveProperty('shop', shop);
    expect(session).toHaveProperty('state');
    expect(session).toHaveProperty('expires', undefined);
  });

  test('sets session id and cookie to shop name prefixed with "offline_" for offline access requests', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', false);
    expect(currentSessionId(res)).toBe(`offline_${shop}`);
>>>>>>> origin/isomorphic/crypto
  });

  test('returns the correct auth url for given info', async () => {
    const authRoute = await ShopifyOAuth.beginAuth(
      req,
      res,
      shop,
      '/some-callback',
      false,
    );
<<<<<<< HEAD
=======
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
>>>>>>> origin/isomorphic/crypto
    /* eslint-disable @typescript-eslint/naming-convention */
    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES.toString(),
      redirect_uri: `${Context.HOST_SCHEME}://${Context.HOST_NAME}/some-callback`,
      state: `offline_${VALID_NONCE}`,
      'grant_options[]': '',
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    const expectedQueryString = querystring.stringify(query);

    expect(authRoute).toBe(
      `https://${shop}/admin/oauth/authorize?${expectedQueryString}`,
    );
  });

  test('returns the correct auth url when the host scheme is http', async () => {
    Context.HOST_SCHEME = 'http';
    const authRoute = await ShopifyOAuth.beginAuth(
      req,
      res,
      shop,
      '/some-callback',
      false,
    );
    /* eslint-disable @typescript-eslint/naming-convention */
    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES.toString(),
      redirect_uri: `http://${Context.HOST_NAME}/some-callback`,
      state: `offline_${VALID_NONCE}`,
      'grant_options[]': '',
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    const expectedQueryString = querystring.stringify(query);

    expect(authRoute).toBe(
      `https://${shop}/admin/oauth/authorize?${expectedQueryString}`,
    );
  });

  test('appends per_user access mode to url when isOnline is set to true', async () => {
    const authRoute = await ShopifyOAuth.beginAuth(
      req,
      res,
      shop,
      '/some-callback',
      true,
    );
<<<<<<< HEAD
=======
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
>>>>>>> origin/isomorphic/crypto

    /* eslint-disable @typescript-eslint/naming-convention */
    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES.toString(),
      redirect_uri: `${Context.HOST_SCHEME}://${Context.HOST_NAME}/some-callback`,
      state: `online_${VALID_NONCE}`,
      'grant_options[]': 'per-user',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const expectedQueryString = querystring.stringify(query);

    expect(authRoute).toBe(
      `https://${shop}/admin/oauth/authorize?${expectedQueryString}`,
    );
  });

  test('fails to start if the app is private', () => {
    Context.IS_PRIVATE_APP = true;
    Context.initialize(Context);

    expect(
      ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true),
    ).rejects.toThrow(Shopify.Errors.PrivateAppError);
  });
});

describe('validateAuthCallback', () => {
  let cookies: {
    id: string;
    expires?: Date;
  } = {
    id: '',
    expires: undefined,
  };
  let req: Request;
  let res: Response;

  beforeEach(() => {
    cookies = {
      id: '',
      expires: undefined,
    };

    req = {} as Request;
    res = {} as Response;

<<<<<<< HEAD
    Cookies.prototype.set.mockImplementation(
      (cookieName: string, cookieValue: string, options?: {expires: Date}) => {
        expect(cookieName).toEqual(
          expect.stringMatching(/^shopify_app_(session|state)/),
        );
        cookies.id = cookieValue;
        cookies.expires = options?.expires;
      },
    );
=======
    // Cookies.prototype.set.mockImplementation(
    //   (cookieName: string, cookieValue: string, options: {expires: Date}) => {
    //     expect(cookieName).toBe('shopify_app_session');
    //     currentSessionId(res) = cookieValue;
    //     cookies.expires = options.expires;
    //   },
    // );
>>>>>>> origin/isomorphic/crypto

    // Cookies.prototype.get.mockImplementation(() => currentSessionId(res));
  });

  test('throws Context error when not properly initialized', async () => {
    Context.API_KEY = '';
<<<<<<< HEAD
=======
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
>>>>>>> origin/isomorphic/crypto
    const testCallbackQuery: AuthQuery = {
      shop,
      state: VALID_NONCE,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    await expect(
      ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery),
    ).rejects.toThrow(Shopify.Errors.UninitializedContextError);
  });

  test("throws an error when receiving a callback for a shop that doesn't have a session cookie", async () => {
    await expect(
      ShopifyOAuth.validateAuthCallback(req, res, {
        shop: 'I do not exist',
      } as AuthQuery),
    ).rejects.toThrow(Shopify.Errors.CookieNotFound);
  });

<<<<<<< HEAD
  test('throws error when callback includes invalid hmac', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback');
=======
  test('throws an error when receiving a callback for a shop with no saved session', async () => {
    await ShopifyOAuth.beginAuth(req, res, 'invalidurl.com', '/some-callback');

    await Context.SESSION_STORAGE.deleteSession(currentSessionId(res));

    await expect(
      ShopifyOAuth.validateAuthCallback(req, res, {
        shop: 'I do not exist',
      } as AuthQuery),
    ).rejects.toThrow(Shopify.Errors.SessionNotFound);
  });

  test('throws error when callback includes invalid hmac, or state', async () => {
    await ShopifyOAuth.beginAuth(req, res, 'invalidurl.com', '/some-callback');
>>>>>>> origin/isomorphic/crypto
    const testCallbackQuery: AuthQuery = {
      shop,
      state: `online_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    testCallbackQuery.hmac = 'definitely the wrong hmac';

    await expect(
      ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery),
    ).rejects.toThrow(Shopify.Errors.InvalidOAuthError);
  });

  test('throws error when callback includes invalid state', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback');
    const testCallbackQuery: AuthQuery = {
      shop,
      state: 'incorrect state',
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    await expect(
      ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery),
    ).rejects.toThrow(ShopifyErrors.InvalidOAuthError);
  });

  test('throws a SessionStorageError when storeSession returns false', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback');
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );

    const testCallbackQuery: AuthQuery = {
      shop,
      state: `online_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = generateLocalHmac(testCallbackQuery);
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

    await expect(
      ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery),
    ).rejects.toThrow(Shopify.Errors.SessionStorageError);
  });

<<<<<<< HEAD
  test('requests access token for valid callbacks with offline access and creates session', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', false);
=======
  test('requests access token for valid callbacks with offline access and updates session', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback');
    let session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
>>>>>>> origin/isomorphic/crypto
    const testCallbackQuery: AuthQuery = {
      shop,
      state: `offline_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = generateLocalHmac(testCallbackQuery);
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
    await ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery);
<<<<<<< HEAD
    expect(cookies.id).toEqual(expect.stringMatching(`offline_${shop}`));
    const session = await Context.SESSION_STORAGE.loadSession(cookies.id);
=======
    session = await Context.SESSION_STORAGE.loadSession(currentSessionId(res));
>>>>>>> origin/isomorphic/crypto

    expect(session?.accessToken).toBe(successResponse.access_token);
  });

  test('requests access token for valid callbacks with online access and creates session with expiration and onlineAccessInfo', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true);
<<<<<<< HEAD
=======
    let session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
>>>>>>> origin/isomorphic/crypto
    const testCallbackQuery: AuthQuery = {
      shop,
      state: `online_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = generateLocalHmac(testCallbackQuery);
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
    await ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery);
<<<<<<< HEAD
    expect(cookies.id).toEqual(
      expect.stringMatching(
        /^[a-f0-9]{8,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{12,}/,
      ),
    );
    const session = await Context.SESSION_STORAGE.loadSession(cookies.id);
=======
    session = await Context.SESSION_STORAGE.loadSession(currentSessionId(res));
>>>>>>> origin/isomorphic/crypto

    expect(session?.accessToken).toBe(successResponse.access_token);
    expect(session?.expires).toBeInstanceOf(Date);
    expect(session?.onlineAccessInfo).toEqual(expectedOnlineAccessInfo);
  });

  test('fails to run if the app is private', () => {
    Context.IS_PRIVATE_APP = true;
    Context.initialize(Context);

    expect(
      ShopifyOAuth.validateAuthCallback(req, res, {} as AuthQuery),
    ).rejects.toThrow(Shopify.Errors.PrivateAppError);
  });

  test('does not set an OAuth cookie for online, embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true);
<<<<<<< HEAD
=======
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
    expect(session).not.toBe(null);
>>>>>>> origin/isomorphic/crypto

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
      state: `online_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    mockAdapter.queueResponse(
      buildMockResponse(JSON.stringify(successResponse)),
    );
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
      res,
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

    const token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, {
      algorithm: 'HS256',
    });
    const jwtReq = {
      method: 'GET',
      url: `https://${shop}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as Request;
    const jwtRes = {} as Response;

    const currentSession = await loadCurrentSession(jwtReq, jwtRes);
    expect(currentSession).not.toBe(null);
    expect(currentSession?.id).toEqual(jwtSessionId);
<<<<<<< HEAD
    expect(cookies.id).not.toBeDefined();
=======
    const jar = currentCookieJar(res);
    const sessionCookie = jar[Shopify.Auth.SESSION_COOKIE_NAME];
    expect(sessionCookie?.expires?.getTime() as number).toBeWithinSecondsOf(
      new Date().getTime(),
      1,
    );
>>>>>>> origin/isomorphic/crypto
  });

  test('properly updates the OAuth cookie for online, non-embedded apps', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true);
<<<<<<< HEAD
=======
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
>>>>>>> origin/isomorphic/crypto

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
      state: `online_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    mockAdapter.queueResponse(
      buildMockResponse(JSON.stringify(successResponse)),
    );
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
      res,
      testCallbackQuery,
    );
<<<<<<< HEAD
    expect(returnedSession.id).toEqual(cookies.id);
    expect(cookies.id).toEqual(
      expect.stringMatching(
        /^[a-f0-9]{8,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{12,}/,
      ),
    );
=======
    expect(returnedSession.id).toEqual(currentSessionId(res));
>>>>>>> origin/isomorphic/crypto

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

  test('does not set an OAuth cookie for offline, embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', false);
<<<<<<< HEAD
=======
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
>>>>>>> origin/isomorphic/crypto

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
      state: `offline_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    mockAdapter.queueResponse(
      buildMockResponse(JSON.stringify(successResponse)),
    );
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
      res,
      testCallbackQuery,
    );
<<<<<<< HEAD
    expect(returnedSession.id).toEqual(ShopifyOAuth.getOfflineSessionId(shop));
=======
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
>>>>>>> origin/isomorphic/crypto
    expect(returnedSession?.expires?.getTime()).toBeUndefined();

    expect(cookies.id).not.toBeDefined();
  });

  test('properly updates the OAuth cookie for offline, non-embedded apps', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', false);
<<<<<<< HEAD
=======
    const session = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
    );
>>>>>>> origin/isomorphic/crypto

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
      state: `offline_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    /* eslint-enable @typescript-eslint/naming-convention */
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    mockAdapter.queueResponse(
      buildMockResponse(JSON.stringify(successResponse)),
    );
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
      res,
      testCallbackQuery,
    );
    expect(returnedSession.id).toEqual(currentSessionId(res));
    expect(returnedSession.id).toEqual(ShopifyOAuth.getOfflineSessionId(shop));
    expect(cookies?.expires?.getTime()).toBeUndefined();
    expect(returnedSession?.expires?.getTime()).toBeUndefined();

    const cookieSession = await Context.SESSION_STORAGE.loadSession(
      currentSessionId(res),
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

function currentCookieJar(res: Response): CookieJar {
  return Cookies.parseCookies(getHeaders(res.headers, 'Set-Cookie') ?? []);
}

function currentSessionId(res: Response): string {
  const jar = currentCookieJar(res);
  return jar[Shopify.Auth.SESSION_COOKIE_NAME]?.value;
}
