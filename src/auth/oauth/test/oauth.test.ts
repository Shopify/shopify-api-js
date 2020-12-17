import '../../../test/test_helper';

import querystring from 'querystring';
import http from 'http';
import jwt from 'jsonwebtoken';

import { ShopifyOAuth } from '../oauth';
import { Context } from '../../../context';
import * as ShopifyErrors from '../../../error';
import { AuthQuery } from '../../types';
import { generateLocalHmac } from '../../../utils/hmac-validator';
import { JwtPayload } from '../../../utils/decode-session-token';
import loadCurrentSession from '../../../utils/load-current-session';

jest.mock('cookies');
import Cookies from 'cookies';

let shop: string;

beforeEach(() => {
  shop = 'someshop.myshopify.io';
  (Cookies as any).mockClear(); // eslint-disable-line @typescript-eslint/no-explicit-any
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
        expect(cookieName).toBe('shopify_app_session');
        cookies.id = cookieValue;
      }
    );
  });

  test('throws Context error when not properly initialized', async () => {
    Context.API_KEY = '';

    await expect(() =>
      ShopifyOAuth.beginAuth(req, res, shop, '/some-callback')
    ).rejects.toBeInstanceOf(ShopifyErrors.UninitializedContextError);
  });

  test('creates and stores a new session for the specified shop', async () => {
    const authRoute = await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback');
    const session = await Context.loadSession(cookies.id);

    expect(Cookies).toHaveBeenCalledTimes(1);
    expect(Cookies.prototype.set).toHaveBeenCalledTimes(1);
    expect(authRoute).toBeDefined();
    expect(session).toBeDefined();
    expect(session).toHaveProperty('id');
    expect(session).toHaveProperty('shop', shop);
    expect(session).toHaveProperty('state');
    expect(session).toHaveProperty('expires', undefined);
  });

  test('sets session id and cookie to shop name with "_offline" for offline access requests', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback');

    expect(cookies.id).toBe(`offline_${shop}`);
  });

  test('returns the correct auth url for given info', async () => {
    const authRoute = await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback');
    const session = await Context.loadSession(cookies.id);
    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES,
      redirect_uri: `https://${Context.HOST_NAME}/some-callback`,
      state: session ? session.state : '',
      'grant_options[]': '',
    };

    const expectedQueryString = querystring.stringify(query);

    expect(authRoute).toBe(`https://${shop}/admin/oauth/authorize?${expectedQueryString}`);
  });

  test('appends per_user access mode to url when isOnline is set to true', async () => {
    const authRoute = await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true);
    const session = await Context.loadSession(cookies.id);

    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES,
      redirect_uri: `https://${Context.HOST_NAME}/some-callback`,
      state: session ? session.state : '',
      'grant_options[]': 'per-user',
    };
    const expectedQueryString = querystring.stringify(query);

    expect(authRoute).toBe(`https://${shop}/admin/oauth/authorize?${expectedQueryString}`);
  });
});

describe('validateAuthCallback', () => {
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
        expect(cookieName).toBe('shopify_app_session');
        cookies.id = cookieValue;
      }
    );

    Cookies.prototype.get.mockImplementation(() => cookies.id);
  });

  test('throws Context error when not properly initialized', async () => {
    Context.API_KEY = '';
    const session = await Context.loadSession(cookies.id);
    const testCallbackQuery: AuthQuery = {
      shop: shop,
      state: session ? session.state : '',
      timestamp: (+new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    await expect(() =>
      ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery)
    ).rejects.toBeInstanceOf(ShopifyErrors.UninitializedContextError);
  });

  test("throws an error when receiving a callback for a shop that doesn't have a session cookie", async () => {
    await expect(() =>
      ShopifyOAuth.validateAuthCallback(req, res, {
        shop: 'I do not exist',
      } as AuthQuery)
    ).rejects.toBeInstanceOf(ShopifyErrors.SessionNotFound);
  });

  test('throws an error when receiving a callback for a shop with no saved session', async () => {
    await ShopifyOAuth.beginAuth(req, res, 'invalidurl.com', '/some-callback');

    Context.deleteSession(cookies.id);

    await expect(() =>
      ShopifyOAuth.validateAuthCallback(req, res, {
        shop: 'I do not exist',
      } as AuthQuery)
    ).rejects.toBeInstanceOf(ShopifyErrors.SessionNotFound);
  });

  test('throws error when callback includes invalid hmac, or state', async () => {
    await ShopifyOAuth.beginAuth(req, res, 'invalidurl.com', '/some-callback');
    const testCallbackQuery: AuthQuery = {
      shop: 'invalidurl.com',
      state: 'incorrect',
      timestamp: (+new Date()).toString(),
      code: 'some random auth code',
    };
    testCallbackQuery.hmac = 'definitely the wrong hmac';

    await expect(() =>
      ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery)
    ).rejects.toBeInstanceOf(ShopifyErrors.InvalidOAuthError);
  });

  test('requests access token for valid callbacks with offline access and updates session', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback');
    let session = await Context.loadSession(cookies.id);
    const testCallbackQuery: AuthQuery = {
      shop: shop,
      state: session ? session.state : '',
      timestamp: (+new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    const successResponse = {
      access_token: 'some access token string',
      scope: Context.SCOPES.join(','),
    };

    fetchMock.mockResponse(JSON.stringify(successResponse));
    await ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery);
    session = await Context.loadSession(cookies.id);

    session
      ? expect(session.accessToken).toBe(successResponse.access_token)
      : false;
  });

  test('requests access token for valid callbacks with online access and updates session with expiration and onlineAccessInfo', async () => {
    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true);
    const session = await Context.loadSession(cookies.id);
    const testCallbackQuery: AuthQuery = {
      shop: shop,
      state: session ? session.state : '',
      timestamp: (+new Date()).toString(),
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
    if (session) {
      expect(session.accessToken).toBe(successResponse.access_token);
      expect(session.expires).toBeInstanceOf(Date);
      expect(session.onlineAccesInfo).toEqual(expectedOnlineAccessInfo);
    } else {
      return false;
    }
  });

  test("converts an OAuth session into a JWT one if is online", async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    await ShopifyOAuth.beginAuth(req, res, shop, '/some-callback', true);
    const session = await Context.loadSession(cookies.id);

    const successResponse = {
      access_token: 'some access token',
      scope: 'pet_kitties, walk_dogs',
      expires_in: '525600',
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
      shop: shop,
      state: session ? session.state : '',
      timestamp: (+new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = generateLocalHmac(testCallbackQuery);
    testCallbackQuery.hmac = expectedHmac;

    fetchMock.mockResponse(JSON.stringify(successResponse));
    await ShopifyOAuth.validateAuthCallback(req, res, testCallbackQuery);

    await expect(Context.loadSession(cookies.id)).resolves.toBeNull();

    const jwtPayload: JwtPayload = {
      iss: `https://${shop}/admin`,
      dest: `https://${shop}`,
      aud: Context.API_KEY,
      sub: "1",
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: "4321",
      sid: "abc123",
    };

    const jwtSessionId = `${shop}_${jwtPayload.sub}`;
    await expect(Context.loadSession(jwtSessionId)).resolves.not.toBeNull();

    // Simulate a subsequent JWT request to see if the session is loaded as the current one

    const token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, { algorithm: 'HS256' });
    const jwtReq = {
      headers: {
        "authorization": `Bearer ${token}`,
      }
    } as http.IncomingMessage;
    const jwtRes = {} as http.ServerResponse;

    const currentSession = await loadCurrentSession(jwtReq, jwtRes);
    expect(currentSession).not.toBe(null);
    expect(currentSession?.id).toEqual(jwtSessionId);
  });
});
