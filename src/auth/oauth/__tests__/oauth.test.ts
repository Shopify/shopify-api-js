import querystring from 'querystring';
import http from 'http';

import jwt from 'jsonwebtoken';
import Cookies from 'cookies';

import {ShopifyOAuth} from '../oauth';
import {config, setConfig} from '../../../config';
import nonce from '../../../utils/nonce';
import * as ShopifyErrors from '../../../error';
import {AuthQuery} from '../types';
import {generateLocalHmac} from '../../../utils/hmac-validator';
import {JwtPayload} from '../../../utils/decode-session-token';
import loadCurrentSession from '../../../utils/load-current-session';
import {CustomSessionStorage} from '../../session';

const VALID_NONCE = 'noncenoncenonce';

jest.mock('cookies');
jest.mock('../../../utils/nonce', () => jest.fn(() => VALID_NONCE));

let shop: string;

beforeEach(() => {
  shop = 'someshop.myshopify.io';
  (Cookies as any).mockClear();
});

describe('beginAuth', () => {
  let cookies = {
    id: '',
  };
  let req: http.IncomingMessage;
  let res: http.ServerResponse;

  beforeEach(() => {
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
  });

  test('sets cookie to state for offline access requests', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', false);

    expect(nonce).toHaveBeenCalled();
    expect(cookies.id).toBe(`offline_${VALID_NONCE}`);
  });

  test('sets cookie to state for online access requests', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true);

    expect(nonce).toHaveBeenCalled();
    expect(cookies.id).toBe(`online_${VALID_NONCE}`);
  });

  test('returns the correct auth url for given info', async () => {
    const authRoute = await ShopifyOAuth.beginAuth(
      req,
      res,
      shop,
      '/some-callback',
      false,
    );
    const query = {
      client_id: config.apiKey,
      scope: config.scopes.toString(),
      redirect_uri: `${config.hostScheme}://${config.hostName}/some-callback`,
      state: `offline_${VALID_NONCE}`,
      'grant_options[]': '',
    };

    const expectedQueryString = querystring.stringify(query);

    expect(authRoute).toBe(
      `https://${shop}/admin/oauth/authorize?${expectedQueryString}`,
    );
  });

  test('returns the correct auth url when the host scheme is http', async () => {
    config.hostScheme = 'http';
    const authRoute = await ShopifyOAuth.beginAuth(
      req,
      res,
      shop,
      '/some-callback',
      false,
    );
    const query = {
      client_id: config.apiKey,
      scope: config.scopes.toString(),
      redirect_uri: `http://${config.hostName}/some-callback`,
      state: `offline_${VALID_NONCE}`,
      'grant_options[]': '',
    };

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

    const query = {
      client_id: config.apiKey,
      scope: config.scopes.toString(),
      redirect_uri: `${config.hostScheme}://${config.hostName}/some-callback`,
      state: `online_${VALID_NONCE}`,
      'grant_options[]': 'per-user',
    };
    const expectedQueryString = querystring.stringify(query);

    expect(authRoute).toBe(
      `https://${shop}/admin/oauth/authorize?${expectedQueryString}`,
    );
  });

  test('fails to start if the app is private', () => {
    config.isPrivateApp = true;
    setConfig(config);

    expect(
      ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true),
    ).rejects.toThrow(ShopifyErrors.PrivateAppError);
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
  let req: http.IncomingMessage;
  let res: http.ServerResponse;

  beforeEach(() => {
    cookies = {
      id: '',
      expires: undefined,
    };

    req = {} as http.IncomingMessage;
    res = {} as http.ServerResponse;

    Cookies.prototype.set.mockImplementation(
      (cookieName: string, cookieValue: string, options?: {expires: Date}) => {
        expect(cookieName).toEqual(
          expect.stringMatching(/^shopify_app_(session|state)/),
        );
        cookies.id = cookieValue;
        cookies.expires = options?.expires;
      },
    );

    Cookies.prototype.get.mockImplementation(() => cookies.id);
  });

  test("throws an error when receiving a callback for a shop that doesn't have a session cookie", async () => {
    await expect(
      ShopifyOAuth.validateAuthCallback(req, res, {
        shop: 'I do not exist',
      } as AuthQuery),
    ).rejects.toThrow(ShopifyErrors.CookieNotFound);
  });

  test('throws error when callback includes invalid hmac', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback');
    const testCallbackQuery: AuthQuery = {
      shop,
      state: `online_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    testCallbackQuery.hmac = 'definitely the wrong hmac';

    await expect(
      ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery),
    ).rejects.toThrow(ShopifyErrors.InvalidOAuthError);
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
    const session = await config.sessionStorage.loadSession(cookies.id);

    const testCallbackQuery: AuthQuery = {
      shop,
      state: `online_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    const successResponse = {
      access_token: 'some access token string',
      scope: config.scopes.toString(),
    };

    fetchMock.mockResponse(JSON.stringify(successResponse));

    // create new storage with broken storeCallback for validateAuthCallback to use
    config.sessionStorage = new CustomSessionStorage(
      () => Promise.resolve(false),
      () => Promise.resolve(session),
      () => Promise.resolve(true),
    );

    await expect(
      ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery),
    ).rejects.toThrow(ShopifyErrors.SessionStorageError);
  });

  test('requests access token for valid callbacks with offline access and creates session', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', false);
    const testCallbackQuery: AuthQuery = {
      shop,
      state: `offline_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    const successResponse = {
      access_token: 'some access token string',
      scope: config.scopes.toString(),
    };

    fetchMock.mockResponse(JSON.stringify(successResponse));
    await ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery);
    expect(cookies.id).toEqual(expect.stringMatching(`offline_${shop}`));
    const session = await config.sessionStorage.loadSession(cookies.id);

    expect(session?.accessToken).toBe(successResponse.access_token);
  });

  test('requests access token for valid callbacks with online access and creates session with expiration and onlineAccessInfo', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true);
    const testCallbackQuery: AuthQuery = {
      shop,
      state: `online_${VALID_NONCE}`,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

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

    fetchMock.mockResponse(JSON.stringify(successResponse));
    await ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery);
    expect(cookies.id).toEqual(
      expect.stringMatching(
        /^[a-f0-9]{8,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{12,}/,
      ),
    );
    const session = await config.sessionStorage.loadSession(cookies.id);

    expect(session?.accessToken).toBe(successResponse.access_token);
    expect(session?.expires).toBeInstanceOf(Date);
    expect(session?.onlineAccessInfo).toEqual(expectedOnlineAccessInfo);
  });

  test('fails to run if the app is private', () => {
    config.isPrivateApp = true;
    setConfig(config);

    expect(
      ShopifyOAuth.validateAuthCallback(req, res, {} as AuthQuery),
    ).rejects.toThrow(ShopifyErrors.PrivateAppError);
  });

  test('does not set an OAuth cookie for online, embedded apps', async () => {
    config.isEmbeddedApp = true;
    setConfig(config);

    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true);

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
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    fetchMock.mockResponse(JSON.stringify(successResponse));
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
      res,
      testCallbackQuery,
    );

    const jwtPayload: JwtPayload = {
      iss: `https://${shop}/admin`,
      dest: `https://${shop}`,
      aud: config.apiKey,
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
    const actualJwtSession = await config.sessionStorage.loadSession(
      jwtSessionId,
    );
    expect(actualJwtSession).not.toBeUndefined();
    expect(actualJwtSession).toEqual(returnedSession);
    const actualJwtExpiration = actualJwtSession?.expires
      ? actualJwtSession.expires.getTime() / 1000
      : 0;
    expect(actualJwtExpiration).toBeWithinSecondsOf(jwtPayload.exp, 1);

    // Simulate a subsequent JWT request to see if the session is loaded as the current one

    const token = jwt.sign(jwtPayload, config.apiSecretKey, {
      algorithm: 'HS256',
    });
    const jwtReq = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as http.IncomingMessage;
    const jwtRes = {} as http.ServerResponse;

    const currentSession = await loadCurrentSession(jwtReq, jwtRes);
    expect(currentSession).not.toBe(null);
    expect(currentSession?.id).toEqual(jwtSessionId);
    expect(cookies.id).not.toBeDefined();
  });

  test('properly updates the OAuth cookie for online, non-embedded apps', async () => {
    config.isEmbeddedApp = false;
    setConfig(config);

    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true);

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
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    fetchMock.mockResponse(JSON.stringify(successResponse));
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
      res,
      testCallbackQuery,
    );
    expect(returnedSession.id).toEqual(cookies.id);
    expect(cookies.id).toEqual(
      expect.stringMatching(
        /^[a-f0-9]{8,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{12,}/,
      ),
    );

    expect(returnedSession?.expires?.getTime() as number).toBeWithinSecondsOf(
      new Date(Date.now() + successResponse.expires_in * 1000).getTime(),
      1,
    );
    expect(cookies?.expires?.getTime() as number).toBeWithinSecondsOf(
      returnedSession?.expires?.getTime() as number,
      1,
    );

    const cookieSession = await config.sessionStorage.loadSession(cookies.id);
    expect(cookieSession).not.toBeUndefined();
  });

  test('does not set an OAuth cookie for offline, embedded apps', async () => {
    config.isEmbeddedApp = true;
    setConfig(config);

    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', false);

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
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    fetchMock.mockResponse(JSON.stringify(successResponse));
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
      res,
      testCallbackQuery,
    );
    expect(returnedSession.id).toEqual(ShopifyOAuth.getOfflineSessionId(shop));
    expect(returnedSession?.expires?.getTime()).toBeUndefined();

    expect(cookies.id).not.toBeDefined();
  });

  test('properly updates the OAuth cookie for offline, non-embedded apps', async () => {
    config.isEmbeddedApp = false;
    setConfig(config);

    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', false);

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
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    fetchMock.mockResponse(JSON.stringify(successResponse));
    const returnedSession = await ShopifyOAuth.validateAuthCallback(
      req,
      res,
      testCallbackQuery,
    );
    expect(returnedSession.id).toEqual(cookies.id);
    expect(returnedSession.id).toEqual(ShopifyOAuth.getOfflineSessionId(shop));
    expect(cookies?.expires?.getTime()).toBeUndefined();
    expect(returnedSession?.expires?.getTime()).toBeUndefined();

    const cookieSession = await config.sessionStorage.loadSession(cookies.id);
    expect(cookieSession).not.toBeUndefined();
  });
});
