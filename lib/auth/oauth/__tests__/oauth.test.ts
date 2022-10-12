import querystring from 'querystring';

import * as ShopifyErrors from '../../../error';
import {createGenerateLocalHmac} from '../../../utils/hmac-validator';
import {JwtPayload} from '../../../session/types';
import {nonce} from '../nonce';
import {CustomSessionStorage} from '../../../../session-storage/custom';
import {
  Cookies,
  NormalizedRequest,
  NormalizedResponse,
} from '../../../../runtime/http';
import {
  queueMockResponse,
  shopify,
  signJWT,
} from '../../../__tests__/test-helper';
import {createGetOfflineId} from '../../../session/session-utils';

const VALID_NONCE = 'noncenoncenonce';
jest.mock('../nonce', () => ({nonce: jest.fn(() => VALID_NONCE)}));

interface QueryMock {
  [key: string]: any;
}

let shop: string;

beforeEach(() => {
  shop = 'someshop.myshopify.io';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('beginAuth', () => {
  let request: NormalizedRequest;

  beforeEach(() => {
    request = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/auth/begin',
    };
  });

  [
    {isOnline: true, type: `online`},
    {isOnline: false, type: 'offline'},
  ].forEach(({isOnline, type}) => {
    test(`sets cookie to state for ${type} access requests`, async () => {
      const response: NormalizedResponse = await shopify.auth.begin({
        shop,
        isOnline,
        callbackPath: '/some-callback',
        rawRequest: request,
      });

      const cookies = new Cookies({} as NormalizedRequest, response, {
        keys: [shopify.config.apiSecretKey],
      });

      expect(nonce).toHaveBeenCalledTimes(1);
      expect(cookies.outgoingCookieJar.shopify_app_state.value).toEqual(
        VALID_NONCE,
      );
    });
  });

  test('returns the correct auth url for given info', async () => {
    const response: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: false,
      callbackPath: '/some-callback',
      rawRequest: request,
    });

    const query = {
      client_id: shopify.config.apiKey,
      scope: shopify.config.scopes.toString(),
      redirect_uri: `${shopify.config.hostScheme}://${shopify.config.hostName}/some-callback`,
      state: VALID_NONCE,
      'grant_options[]': '',
    };
    const expectedQueryString = querystring.stringify(query);

    expect(response.statusCode).toBe(302);
    expect(response.headers?.Location).toBe(
      `https://${shop}/admin/oauth/authorize?${expectedQueryString}`,
    );
  });

  test('returns the correct auth url when the host scheme is http', async () => {
    shopify.config.hostScheme = 'http';

    const response: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: false,
      callbackPath: '/some-callback',
      rawRequest: request,
    });

    const query = {
      client_id: shopify.config.apiKey,
      scope: shopify.config.scopes.toString(),
      redirect_uri: `http://${shopify.config.hostName}/some-callback`,
      state: VALID_NONCE,
      'grant_options[]': '',
    };
    const expectedQueryString = querystring.stringify(query);

    expect(response.statusCode).toBe(302);
    expect(response.headers?.Location).toBe(
      `https://${shop}/admin/oauth/authorize?${expectedQueryString}`,
    );
  });

  test('appends per_user access mode to url when isOnline is set to true', async () => {
    const response: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: true,
      callbackPath: '/some-callback',
      rawRequest: request,
    });

    const query = {
      client_id: shopify.config.apiKey,
      scope: shopify.config.scopes.toString(),
      redirect_uri: `${shopify.config.hostScheme}://${shopify.config.hostName}/some-callback`,
      state: VALID_NONCE,
      'grant_options[]': 'per-user',
    };
    const expectedQueryString = querystring.stringify(query);

    expect(response.statusCode).toBe(302);
    expect(response.headers?.Location).toBe(
      `https://${shop}/admin/oauth/authorize?${expectedQueryString}`,
    );
  });

  test('fails to start if the app is private', () => {
    shopify.config.isPrivateApp = true;

    expect(
      shopify.auth.begin({
        shop,
        isOnline: true,
        callbackPath: '/some-callback',
        rawRequest: request,
      }),
    ).rejects.toThrow(ShopifyErrors.PrivateAppError);
  });
});

describe('callback', () => {
  let request: NormalizedRequest;

  beforeEach(() => {
    request = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/auth/some-callback',
    };
  });

  test('fails to run if the app is private', () => {
    shopify.config.isPrivateApp = true;

    expect(
      shopify.auth.callback({
        isOnline: true,
        rawRequest: request,
      }),
    ).rejects.toThrow(ShopifyErrors.PrivateAppError);
  });

  test("throws an error when receiving a callback for a shop that doesn't have a state cookie", async () => {
    request.url += '?shop=I+do+not+exist';

    await expect(
      shopify.auth.callback({
        isOnline: true,
        rawRequest: request,
      }),
    ).rejects.toThrow(ShopifyErrors.CookieNotFound);
  });

  test('throws error when callback includes invalid hmac', async () => {
    const response: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: true,
      callbackPath: '/some-callback',
      rawRequest: request,
    });
    setCallbackCookieFromResponse(request, response);

    const testCallbackQuery: QueryMock = {
      shop,
      state: VALID_NONCE,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    testCallbackQuery.hmac = 'definitely the wrong hmac';
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    await expect(
      shopify.auth.callback({
        isOnline: true,
        rawRequest: request,
      }),
    ).rejects.toThrow(ShopifyErrors.InvalidOAuthError);
  });

  test('throws error when callback includes invalid state', async () => {
    const response: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: true,
      callbackPath: '/some-callback',
      rawRequest: request,
    });
    setCallbackCookieFromResponse(request, response);

    const testCallbackQuery: QueryMock = {
      shop,
      state: 'incorrect state',
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await createGenerateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    await expect(
      shopify.auth.callback({
        isOnline: true,
        rawRequest: request,
      }),
    ).rejects.toThrow(ShopifyErrors.InvalidOAuthError);
  });

  test('throws a SessionStorageError when storeSession returns false', async () => {
    // create new storage with broken storeCallback for callback to use
    shopify.config.sessionStorage = new CustomSessionStorage(
      () => Promise.resolve(false),
      () => Promise.resolve(undefined),
      () => Promise.resolve(true),
    );

    const response: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: true,
      callbackPath: '/some-callback',
      rawRequest: request,
    });
    setCallbackCookieFromResponse(request, response);

    const testCallbackQuery: QueryMock = {
      shop,
      state: VALID_NONCE,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await createGenerateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

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

    queueMockResponse(JSON.stringify(successResponse));

    await expect(
      shopify.auth.callback({
        isOnline: true,
        rawRequest: request,
      }),
    ).rejects.toThrow(ShopifyErrors.SessionStorageError);
  });

  test('requests access token for valid callbacks with offline access and creates session', async () => {
    const beginResponse: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: false,
      callbackPath: '/some-callback',
      rawRequest: request,
    });
    setCallbackCookieFromResponse(request, beginResponse);

    const testCallbackQuery: QueryMock = {
      shop,
      state: VALID_NONCE,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await createGenerateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    const successResponse = {
      access_token: 'some access token string',
      scope: shopify.config.scopes.toString(),
    };

    queueMockResponse(JSON.stringify(successResponse));

    const callbackResponse = await shopify.auth.callback({
      isOnline: false,
      rawRequest: request,
    });

    const expectedId = `offline_${shop}`;
    const responseCookies = Cookies.parseCookies(
      callbackResponse.headers['Set-Cookie'],
    );
    expect(responseCookies.shopify_app_session.value).toEqual(expectedId);
    expect(callbackResponse.session.accessToken).toBe(
      successResponse.access_token,
    );

    const session = await shopify.config.sessionStorage.loadSession(expectedId);
    expect(session?.accessToken).toBe(successResponse.access_token);
  });

  test('requests access token for valid callbacks with online access and creates session with expiration and onlineAccessInfo', async () => {
    const beginResponse: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: true,
      callbackPath: '/some-callback',
      rawRequest: request,
    });
    setCallbackCookieFromResponse(request, beginResponse);

    const testCallbackQuery: QueryMock = {
      shop,
      state: VALID_NONCE,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await createGenerateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

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

    queueMockResponse(JSON.stringify(successResponse));

    const callbackResponse = await shopify.auth.callback({
      isOnline: true,
      rawRequest: request,
    });

    const responseCookies = Cookies.parseCookies(
      callbackResponse.headers['Set-Cookie'],
    );
    expect(responseCookies.shopify_app_session.value).toEqual(
      expect.stringMatching(
        /^[a-f0-9]{8,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{12,}/,
      ),
    );
    expect(callbackResponse.session.accessToken).toBe(
      successResponse.access_token,
    );

    const session = await shopify.config.sessionStorage.loadSession(
      responseCookies.shopify_app_session!.value,
    );

    expect(session?.accessToken).toBe(successResponse.access_token);
    expect(session?.expires).toBeInstanceOf(Date);
    expect(session?.onlineAccessInfo).toEqual(expectedOnlineAccessInfo);
  });

  test('does not set an OAuth cookie for online, embedded apps', async () => {
    shopify.config.isEmbeddedApp = true;

    const beginResponse: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: true,
      callbackPath: '/some-callback',
      rawRequest: request,
    });
    setCallbackCookieFromResponse(request, beginResponse);

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
    const testCallbackQuery: QueryMock = {
      shop,
      state: VALID_NONCE,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await createGenerateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    queueMockResponse(JSON.stringify(successResponse));

    const callbackResponse = await shopify.auth.callback({
      isOnline: true,
      rawRequest: request,
    });

    const jwtPayload: JwtPayload = {
      iss: `https://${shop}/admin`,
      dest: `https://${shop}`,
      aud: shopify.config.apiKey,
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
    const actualJwtSession = await shopify.config.sessionStorage.loadSession(
      jwtSessionId,
    );
    expect(actualJwtSession).not.toBeUndefined();
    expect(actualJwtSession).toEqual(callbackResponse.session);
    const actualJwtExpiration = actualJwtSession?.expires
      ? actualJwtSession.expires.getTime() / 1000
      : 0;
    expect(actualJwtExpiration).toBeWithinSecondsOf(jwtPayload.exp, 1);

    // Simulate a subsequent JWT request to see if the session is loaded as the current one

    const token = await signJWT(shopify.config.apiSecretKey, jwtPayload);
    const jwtReq = {
      method: 'GET',
      url: 'https://my-test-app.myshopify.io/totally-real-request',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } as NormalizedRequest;

    const currentSession = await shopify.session.getCurrent({
      isOnline: true,
      rawRequest: jwtReq,
    });
    expect(currentSession).not.toBe(null);
    expect(currentSession?.id).toEqual(jwtSessionId);

    const responseCookies = Cookies.parseCookies(
      callbackResponse.headers['Set-Cookie'],
    );
    expect(responseCookies.shopify_app_session).toBeUndefined();
  });

  test('properly updates the OAuth cookie for online, non-embedded apps', async () => {
    shopify.config.isEmbeddedApp = false;

    const beginResponse: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: true,
      callbackPath: '/some-callback',
      rawRequest: request,
    });
    setCallbackCookieFromResponse(request, beginResponse);

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
    const testCallbackQuery: QueryMock = {
      shop,
      state: VALID_NONCE,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await createGenerateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    queueMockResponse(JSON.stringify(successResponse));

    const callbackResponse = await shopify.auth.callback({
      isOnline: true,
      rawRequest: request,
    });

    const responseCookies = Cookies.parseCookies(
      callbackResponse.headers['Set-Cookie'],
    );

    const cookieId = responseCookies.shopify_app_session!.value;
    const expectedExpiration = new Date(
      Date.now() + successResponse.expires_in * 1000,
    ).getTime();

    expect(cookieId).toEqual(
      expect.stringMatching(
        /^[a-f0-9]{8,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{4,}-[a-f0-9]{12,}/,
      ),
    );
    expect(callbackResponse.session.id).toEqual(cookieId);
    expect(callbackResponse.session.accessToken).toBe(
      successResponse.access_token,
    );
    expect(callbackResponse.session?.expires?.getTime()).toBeWithinSecondsOf(
      expectedExpiration,
      1,
    );
    expect(
      responseCookies.shopify_app_session.expires?.getTime(),
    ).toBeWithinSecondsOf(expectedExpiration, 1);

    const cookieSession = await shopify.config.sessionStorage.loadSession(
      cookieId,
    );
    expect(cookieSession).not.toBeUndefined();
  });

  test('does not set an OAuth cookie for offline, embedded apps', async () => {
    shopify.config.isEmbeddedApp = true;

    const beginResponse: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: false,
      callbackPath: '/some-callback',
      rawRequest: request,
    });
    setCallbackCookieFromResponse(request, beginResponse);

    const successResponse = {
      access_token: 'some access token',
      scope: 'pet_kitties, walk_dogs',
      expires_in: 525600,
    };
    const testCallbackQuery: QueryMock = {
      shop,
      state: VALID_NONCE,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await createGenerateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    queueMockResponse(JSON.stringify(successResponse));

    const callbackResponse = await shopify.auth.callback({
      isOnline: false,
      rawRequest: request,
    });

    const responseCookies = Cookies.parseCookies(
      callbackResponse.headers['Set-Cookie'],
    );

    expect(callbackResponse.session.id).toEqual(
      createGetOfflineId(shopify.config)(shop),
    );
    expect(callbackResponse.session.expires?.getTime()).toBeUndefined();

    expect(responseCookies.shopify_app_session).toBeUndefined();
  });

  test('properly updates the OAuth cookie for offline, non-embedded apps', async () => {
    shopify.config.isEmbeddedApp = false;

    const beginResponse: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: false,
      callbackPath: '/some-callback',
      rawRequest: request,
    });
    setCallbackCookieFromResponse(request, beginResponse);

    const successResponse = {
      access_token: 'some access token',
      scope: 'pet_kitties, walk_dogs',
      expires_in: 525600,
    };
    const testCallbackQuery: QueryMock = {
      shop,
      state: VALID_NONCE,
      timestamp: Number(new Date()).toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await createGenerateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    queueMockResponse(JSON.stringify(successResponse));

    const callbackResponse = await shopify.auth.callback({
      isOnline: false,
      rawRequest: request,
    });

    const responseCookies = Cookies.parseCookies(
      callbackResponse.headers['Set-Cookie'],
    );
    const cookieId = responseCookies.shopify_app_session!.value;

    expect(callbackResponse.session.id).toEqual(cookieId);
    expect(callbackResponse.session.id).toEqual(
      createGetOfflineId(shopify.config)(shop),
    );
    expect(callbackResponse.session.expires?.getTime()).toBeUndefined();
    expect(
      responseCookies.shopify_app_session.expires?.getTime(),
    ).toBeUndefined();

    const cookieSession = await shopify.config.sessionStorage.loadSession(
      cookieId,
    );
    expect(cookieSession).not.toBeUndefined();
  });
});

function setCallbackCookieFromResponse(
  request: NormalizedRequest,
  response: NormalizedResponse,
) {
  // Set the oauth begin state cookie as the request here
  const responseCookies = new Cookies({} as NormalizedRequest, response, {
    keys: [shopify.config.apiSecretKey],
  });

  request.headers.Cookie = [
    `shopify_app_state=${responseCookies.outgoingCookieJar.shopify_app_state.value}`,
    `shopify_app_state.sig=${responseCookies.outgoingCookieJar['shopify_app_state.sig'].value}`,
  ].join(';');
}
