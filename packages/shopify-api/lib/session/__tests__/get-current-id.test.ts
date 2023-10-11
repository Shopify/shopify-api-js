import {setSignedSessionCookie, signJWT} from '../../__tests__/test-helper';
import {testConfig} from '../../__tests__/test-config';
import * as ShopifyErrors from '../../error';
import {NormalizedRequest} from '../../../runtime/http';
import {JwtPayload} from '../types';
import {getOfflineId} from '../session-utils';
import {shopifyApi} from '../..';

describe('loadCurrentSession', () => {
  let jwtPayload: JwtPayload;

  beforeEach(() => {
    jwtPayload = {
      iss: 'https://test-shop.myshopify.io/admin',
      dest: 'https://test-shop.myshopify.io',
      aud: 'test_key',
      sub: '1',
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: '4321',
      sid: 'abc123',
    };
  });

  it('gets the current session id from cookies for non-embedded apps', async () => {
    const shopify = shopifyApi(testConfig({isEmbeddedApp: false}));

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    const cookieId = '1234-this-is-a-cookie-session-id';
    await setSignedSessionCookie({
      apiSecretKey: shopify.config.apiSecretKey,
      request,
      cookieId,
    });

    await expect(
      shopify.session.getCurrentId({isOnline: true, rawRequest: request}),
    ).resolves.toEqual(cookieId);
  });

  it('loads nothing if there is no session id for non-embedded apps', async () => {
    const shopify = shopifyApi(testConfig({isEmbeddedApp: false}));

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await expect(
      shopify.session.getCurrentId({isOnline: true, rawRequest: request}),
    ).resolves.toBeUndefined();
  });

  it('gets the current session id from JWT token for embedded apps', async () => {
    const shopify = shopifyApi(testConfig({isEmbeddedApp: true}));

    const token = await signJWT(shopify.config.apiSecretKey, jwtPayload);
    const request: NormalizedRequest = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await expect(
      shopify.session.getCurrentId({isOnline: true, rawRequest: request}),
    ).resolves.toEqual(`test-shop.myshopify.io_${jwtPayload.sub}`);
  });

  it('loads nothing if no authorization header is present', async () => {
    const shopify = shopifyApi(testConfig({isEmbeddedApp: true}));

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await expect(
      shopify.session.getCurrentId({isOnline: true, rawRequest: request}),
    ).resolves.toBeUndefined();
  });

  it('fails if authorization header is missing or is not a Bearer token', async () => {
    const shopify = shopifyApi(testConfig({isEmbeddedApp: true}));

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {
        Authorization: 'Not a Bearer token!',
      },
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await expect(() =>
      shopify.session.getCurrentId({isOnline: true, rawRequest: request}),
    ).rejects.toBeInstanceOf(ShopifyErrors.MissingJwtTokenError);
  });

  it('loads offline session id from cookies', async () => {
    const shopify = shopifyApi(testConfig({isEmbeddedApp: false}));

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };
    const cookieId = getOfflineId(shopify.config)('test-shop.myshopify.io');
    await setSignedSessionCookie({
      apiSecretKey: shopify.config.apiSecretKey,
      request,
      cookieId,
    });

    await expect(
      shopify.session.getCurrentId({isOnline: false, rawRequest: request}),
    ).resolves.toEqual(cookieId);
  });

  it('loads offline session id from JWT token', async () => {
    const shopify = shopifyApi(testConfig({isEmbeddedApp: true}));

    const token = await signJWT(shopify.config.apiSecretKey, jwtPayload);
    const request: NormalizedRequest = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    const offlineSessionId = getOfflineId(shopify.config)(
      'test-shop.myshopify.io',
    );

    await expect(
      shopify.session.getCurrentId({isOnline: false, rawRequest: request}),
    ).resolves.toEqual(offlineSessionId);
  });

  test('fails to load a cookie session id for embedded apps', async () => {
    const shopify = shopifyApi(testConfig({isEmbeddedApp: true}));

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    const cookieId = '1234-this-is-a-cookie-session-id';
    await setSignedSessionCookie({
      apiSecretKey: shopify.config.apiSecretKey,
      request,
      cookieId,
    });

    await expect(
      shopify.session.getCurrentId({isOnline: true, rawRequest: request}),
    ).resolves.toBeUndefined();
  });
});
