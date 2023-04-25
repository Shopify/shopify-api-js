import querystring from 'querystring';

import * as ShopifyErrors from '../../../error';
import {
  generateLocalHmac,
  getCurrentTimeInSec,
} from '../../../utils/hmac-validator';
import {JwtPayload} from '../../../session/types';
import {nonce} from '../nonce';
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
import {getOfflineId} from '../../../session/session-utils';

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

  test('response with a 410 when the request is a bot', async () => {
    request.headers['User-Agent'] = 'Googlebot';

    const response: NormalizedResponse = await shopify.auth.begin({
      shop,
      isOnline: true,
      callbackPath: '/some-callback',
      rawRequest: request,
    });

    expect(response.statusCode).toBe(410);
  });

  test('fails to start if the app is private', () => {
    shopify.config.isCustomStoreApp = true;

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
      url: '/auth/some-callback',
    };
  });

  test('fails to run if the app is private', () => {
    shopify.config.isCustomStoreApp = true;

    expect(shopify.auth.callback({rawRequest: request})).rejects.toThrow(
      ShopifyErrors.PrivateAppError,
    );
  });

  test("throws an error when receiving a callback for a shop that doesn't have a state cookie", async () => {
    request.url += '?shop=I+do+not+exist';

    await expect(shopify.auth.callback({rawRequest: request})).rejects.toThrow(
      ShopifyErrors.CookieNotFound,
    );
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
      timestamp: getCurrentTimeInSec().toString(),
      code: 'some random auth code',
    };
    testCallbackQuery.hmac = 'definitely the wrong hmac';
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    await expect(shopify.auth.callback({rawRequest: request})).rejects.toThrow(
      ShopifyErrors.InvalidOAuthError,
    );
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
      timestamp: getCurrentTimeInSec().toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await generateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    await expect(shopify.auth.callback({rawRequest: request})).rejects.toThrow(
      ShopifyErrors.InvalidOAuthError,
    );
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
      timestamp: getCurrentTimeInSec().toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await generateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    const successResponse = {
      access_token: 'some access token string',
      scope: shopify.config.scopes.toString(),
    };

    queueMockResponse(JSON.stringify(successResponse));

    const callbackResponse = await shopify.auth.callback({rawRequest: request});
    if (!callbackResponse) {
      fail('Callback response is undefined');
    }
    const expectedId = `offline_${shop}`;
    const responseCookies = Cookies.parseCookies(
      callbackResponse.headers['Set-Cookie'],
    );
    expect(responseCookies.shopify_app_session.value).toEqual(expectedId);
    expect(callbackResponse.session.accessToken).toBe(
      successResponse.access_token,
    );
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
      timestamp: getCurrentTimeInSec().toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await generateLocalHmac(shopify.config)(
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

    const callbackResponse = await shopify.auth.callback({rawRequest: request});

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
      timestamp: getCurrentTimeInSec().toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await generateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    queueMockResponse(JSON.stringify(successResponse));

    const callbackResponse = await shopify.auth.callback({rawRequest: request});

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

    // Simulate a subsequent JWT request to see if the session is loaded as the current one
    const token = await signJWT(shopify.config.apiSecretKey, jwtPayload);
    const jwtReq = {
      method: 'GET',
      url: 'https://my-test-app.myshopify.io/totally-real-request',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    } as NormalizedRequest;

    const currentSessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: jwtReq,
    });
    expect(currentSessionId).toEqual(jwtSessionId);

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
      timestamp: getCurrentTimeInSec().toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await generateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    queueMockResponse(JSON.stringify(successResponse));

    const callbackResponse = await shopify.auth.callback({rawRequest: request});

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
      timestamp: getCurrentTimeInSec().toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await generateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    queueMockResponse(JSON.stringify(successResponse));

    const callbackResponse = await shopify.auth.callback({rawRequest: request});

    const responseCookies = Cookies.parseCookies(
      callbackResponse.headers['Set-Cookie'],
    );

    expect(callbackResponse.session.id).toEqual(
      getOfflineId(shopify.config)(shop),
    );
    expect(callbackResponse.session.expires?.getTime()).toBeUndefined();

    expect(responseCookies.shopify_app_session).toBeUndefined();
  });

  test('callback throws an error when the request is done by a bot', async () => {
    const botRequest = {
      method: 'GET',
      url: 'https://my-test-app.myshopify.io/totally-real-request',
      headers: {
        'User-Agent': 'Googlebot',
      },
    } as NormalizedRequest;

    await expect(
      shopify.auth.callback({
        rawRequest: botRequest,
      }),
    ).rejects.toThrow(ShopifyErrors.BotActivityDetected);
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
      timestamp: getCurrentTimeInSec().toString(),
      code: 'some random auth code',
    };
    const expectedHmac = await generateLocalHmac(shopify.config)(
      testCallbackQuery,
    );
    testCallbackQuery.hmac = expectedHmac;
    request.url += `?${new URLSearchParams(testCallbackQuery).toString()}`;

    queueMockResponse(JSON.stringify(successResponse));

    const callbackResponse = await shopify.auth.callback({rawRequest: request});

    const responseCookies = Cookies.parseCookies(
      callbackResponse.headers['Set-Cookie'],
    );
    const cookieId = responseCookies.shopify_app_session!.value;

    expect(callbackResponse.session.id).toEqual(cookieId);
    expect(callbackResponse.session.id).toEqual(
      getOfflineId(shopify.config)(shop),
    );
    expect(callbackResponse.session.expires?.getTime()).toBeUndefined();
    expect(
      responseCookies.shopify_app_session.expires?.getTime(),
    ).toBeUndefined();
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
