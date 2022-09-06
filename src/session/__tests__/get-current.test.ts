import {
  shopify,
  setSignedSessionCookie,
  createAndSaveDummySession,
  signJWT,
} from '../../__tests__/test-helper';
import * as ShopifyErrors from '../../error';
import {NormalizedRequest} from '../../runtime/http';
import {JwtPayload} from '../../utils/types';
import {createGetOfflineId} from '../session-utils';
import {Session} from '../session';

describe('loadCurrentSession', () => {
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

  it('gets the current session from cookies for non-embedded apps', async () => {
    shopify.config.isEmbeddedApp = false;

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    const cookieId = '1234-this-is-a-cookie-session-id';
    await setSignedSessionCookie({request, cookieId});

    const session = await createAndSaveDummySession({
      sessionId: cookieId,
      isOnline: true,
    });

    await expect(
      shopify.session.getCurrent({isOnline: true, rawRequest: request}),
    ).resolves.toEqual(session);
  });

  it('loads nothing if there is no session for non-embedded apps', async () => {
    shopify.config.isEmbeddedApp = false;

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await expect(
      shopify.session.getCurrent({isOnline: true, rawRequest: request}),
    ).resolves.toBeUndefined();
  });

  it('gets the current session from JWT token for embedded apps', async () => {
    shopify.config.isEmbeddedApp = true;

    const token = await signJWT(shopify.config.apiSecretKey, jwtPayload);
    const request: NormalizedRequest = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    const session = await createAndSaveDummySession({
      sessionId: `test-shop.myshopify.io_${jwtPayload.sub}`,
      isOnline: true,
    });

    await expect(
      shopify.session.getCurrent({isOnline: true, rawRequest: request}),
    ).resolves.toEqual(session);
  });

  it('loads nothing if no authorization header is present', async () => {
    shopify.config.isEmbeddedApp = true;

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await expect(
      shopify.session.getCurrent({isOnline: true, rawRequest: request}),
    ).resolves.toBeUndefined();
  });

  it('loads nothing if there is no session for embedded apps', async () => {
    shopify.config.isEmbeddedApp = true;

    const token = await signJWT(shopify.config.apiSecretKey, jwtPayload);
    const request: NormalizedRequest = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await expect(
      shopify.session.getCurrent({isOnline: true, rawRequest: request}),
    ).resolves.toBeUndefined();
  });

  it('fails if authorization header is missing or is not a Bearer token', async () => {
    shopify.config.isEmbeddedApp = true;

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {
        Authorization: 'Not a Bearer token!',
      },
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await expect(() =>
      shopify.session.getCurrent({isOnline: true, rawRequest: request}),
    ).rejects.toBeInstanceOf(ShopifyErrors.MissingJwtTokenError);
  });

  it('loads offline sessions from cookies', async () => {
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

    const session = await createAndSaveDummySession({
      sessionId: cookieId,
      isOnline: false,
    });

    await expect(
      shopify.session.getCurrent({isOnline: false, rawRequest: request}),
    ).resolves.toEqual(session);
  });

  it('loads offline sessions from JWT token', async () => {
    shopify.config.isEmbeddedApp = true;

    const token = await signJWT(shopify.config.apiSecretKey, jwtPayload);
    const request: NormalizedRequest = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    const session = await createAndSaveDummySession({
      sessionId: createGetOfflineId(shopify.config)('test-shop.myshopify.io'),
      isOnline: false,
    });

    await expect(
      shopify.session.getCurrent({isOnline: false, rawRequest: request}),
    ).resolves.toEqual(session);
  });

  test('fails to load a cookie session for embedded apps', async () => {
    shopify.config.isEmbeddedApp = true;

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    const cookieId = '1234-this-is-a-cookie-session-id';
    await setSignedSessionCookie({request, cookieId});

    const session = await createAndSaveDummySession({
      sessionId: cookieId,
      isOnline: true,
    });

    expect(session).toBeInstanceOf(Session);
    await expect(
      shopify.session.getCurrent({isOnline: true, rawRequest: request}),
    ).resolves.toBeUndefined();
  });
});
