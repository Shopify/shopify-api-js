import {
  shopify,
  setSignedSessionCookie,
  createAndSaveDummySession,
  signJWT,
} from '../../__tests__/test-helper';
import * as ShopifyErrors from '../../error';
import {JwtPayload} from '../types';
import {createGetOfflineId} from '../session-utils';
import {NormalizedRequest} from '../../runtime/http';

describe('deleteCurrenSession', () => {
  let jwtPayload: JwtPayload;

  beforeEach(() => {
    jwtPayload = {
      iss: 'https://test-shop.myshopify.io/admin',
      dest: 'https://test-shop.myshopify.io',
      aud: shopify.config.apiKey,
      sub: '1',
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: '4321',
      sid: 'abc123',
    };
  });

  it('finds and deletes the current session when using cookies', async () => {
    shopify.config.isEmbeddedApp = false;

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    const cookieId = '1234-this-is-a-cookie-session-id';
    await setSignedSessionCookie({request, cookieId});

    await createAndSaveDummySession({sessionId: cookieId, isOnline: true});

    await expect(
      shopify.session.deleteCurrent({isOnline: true, rawRequest: request}),
    ).resolves.toBe(true);
    await expect(
      shopify.session.getCurrent({isOnline: true, rawRequest: request}),
    ).resolves.toBe(undefined);
  });

  it('finds and deletes the current session when using JWT', async () => {
    shopify.config.isEmbeddedApp = true;

    const token = await signJWT(shopify.config.apiSecretKey, jwtPayload);
    const request: NormalizedRequest = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await createAndSaveDummySession({
      sessionId: `test-shop.myshopify.io_${jwtPayload.sub}`,
      isOnline: true,
    });

    await expect(
      shopify.session.deleteCurrent({isOnline: true, rawRequest: request}),
    ).resolves.toBe(true);
    await expect(
      shopify.session.getCurrent({isOnline: true, rawRequest: request}),
    ).resolves.toBe(undefined);
  });

  it('finds and deletes the current offline session when using cookies', async () => {
    shopify.config.isEmbeddedApp = false;

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    const cookieId = createGetOfflineId(shopify.config)(
      'test-shop.myshopify.io',
    );
    await setSignedSessionCookie({request, cookieId});

    await createAndSaveDummySession({
      sessionId: cookieId,
      isOnline: true,
    });

    await expect(
      shopify.session.deleteCurrent({isOnline: false, rawRequest: request}),
    ).resolves.toBe(true);
    await expect(
      shopify.session.getCurrent({isOnline: false, rawRequest: request}),
    ).resolves.toBe(undefined);
  });

  it('finds and deletes the current offline session when using JWT', async () => {
    shopify.config.isEmbeddedApp = true;

    const token = await signJWT(shopify.config.apiSecretKey, jwtPayload);
    const request: NormalizedRequest = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await createAndSaveDummySession({
      sessionId: createGetOfflineId(shopify.config)('test-shop.myshopify.io'),
      isOnline: true,
    });

    await expect(
      shopify.session.deleteCurrent({
        isOnline: false,
        rawRequest: request,
      }),
    ).resolves.toBe(true);
    await expect(
      shopify.session.getCurrent({
        isOnline: false,
        rawRequest: request,
      }),
    ).resolves.toBe(undefined);
  });

  it('throws an error when no cookie is found', async () => {
    shopify.config.isEmbeddedApp = false;

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await expect(() =>
      shopify.session.deleteCurrent({
        isOnline: true,
        rawRequest: request,
      }),
    ).rejects.toBeInstanceOf(ShopifyErrors.SessionNotFound);
  });

  it('throws an error when authorization header is not a bearer token', async () => {
    shopify.config.isEmbeddedApp = true;

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {
        Authorization: "What's a bearer token?",
      },
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await expect(() =>
      shopify.session.deleteCurrent({
        isOnline: true,
        rawRequest: request,
      }),
    ).rejects.toBeInstanceOf(ShopifyErrors.MissingJwtTokenError);
  });
});
