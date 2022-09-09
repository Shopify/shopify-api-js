import {
  createAndSaveDummySession,
  setSignedSessionCookie,
  shopify,
  signJWT,
} from '../../__tests__/test-helper';
import * as ShopifyErrors from '../../error';
import {NormalizedRequest} from '../../runtime/http';
import {createGetJwtSessionId, createGetOfflineId} from '../session-utils';
import {JwtPayload} from '../../utils/types';
import {GraphqlWithSession, RestWithSession} from '../types';
import {ClientType} from '../../base-types';

describe('withSession', () => {
  const shop = 'test-shop.myshopify.io';
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

  it('throws an error for unsupported clientTypes', async () => {
    shopify.config.isEmbeddedApp = true;

    const token = await signJWT(shopify.config.apiSecretKey, jwtPayload);
    const request: NormalizedRequest = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    /* we need to set up a session for this test, because errors will be thrown for a missing session before
    hitting the clientType error */
    await createAndSaveDummySession({
      sessionId: createGetOfflineId(shopify.config)(shop),
      isOnline: false,
      shop,
      accessToken: 'gimme-access',
    });

    await expect(
      shopify.session.withSession({
        clientType: 'blah' as any,
        isOnline: false,
        rawRequest: request,
      }),
    ).rejects.toThrow(ShopifyErrors.UnsupportedClientType);
  });

  it('throws an error when there is no session matching the params requested', async () => {
    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };

    await expect(
      shopify.session.withSession({
        clientType: ClientType.Rest,
        isOnline: false,
        rawRequest: request,
      }),
    ).rejects.toThrow(ShopifyErrors.SessionNotFound);
    await expect(
      shopify.session.withSession({
        clientType: ClientType.Graphql,
        isOnline: true,
        rawRequest: request,
      }),
    ).rejects.toThrowError(ShopifyErrors.SessionNotFound);
  });

  it('throws an error when the session is not yet authenticated (has no access token)', async () => {
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
      sessionId: createGetOfflineId(shopify.config)(shop),
      isOnline: false,
    });

    await expect(
      shopify.session.withSession({
        clientType: ClientType.Rest,
        isOnline: false,
        rawRequest: request,
      }),
    ).rejects.toThrow(ShopifyErrors.InvalidSession);
  });

  it('returns an object containing the appropriate client and session for offline sessions', async () => {
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
      sessionId: createGetOfflineId(shopify.config)(shop),
      isOnline: false,
      accessToken: 'gimme-access',
    });

    const restRequestCtx = (await shopify.session.withSession({
      clientType: ClientType.Rest,
      isOnline: false,
      rawRequest: request,
    })) as RestWithSession;

    const gqlRequestCtx = (await shopify.session.withSession({
      clientType: ClientType.Graphql,
      isOnline: false,
      rawRequest: request,
    })) as GraphqlWithSession;

    expect(restRequestCtx).toBeDefined();
    expect(restRequestCtx.session.shop).toBe(shop);
    expect(restRequestCtx.client.get).toBeDefined();

    expect(gqlRequestCtx).toBeDefined();
    expect(gqlRequestCtx.session.shop).toBe(shop);
    expect(gqlRequestCtx.client.query).toBeDefined();
  });

  it('returns an object containing the appropriate client and session for online && non-embedded apps', async () => {
    shopify.config.isEmbeddedApp = false;

    const request: NormalizedRequest = {
      method: 'GET',
      headers: {},
      url: 'https://my-test-app.myshopify.io/my-endpoint',
    };
    const cookieId = '12345';
    await setSignedSessionCookie({request, cookieId});

    await createAndSaveDummySession({
      sessionId: '12345',
      isOnline: true,
      accessToken: 'gimme-access',
    });

    const restRequestCtx = (await shopify.session.withSession({
      clientType: ClientType.Rest,
      isOnline: true,
      rawRequest: request,
    })) as RestWithSession;

    const gqlRequestCtx = (await shopify.session.withSession({
      clientType: ClientType.Graphql,
      isOnline: true,
      rawRequest: request,
    })) as GraphqlWithSession;

    expect(restRequestCtx).toBeDefined();
    expect(restRequestCtx.session.shop).toBe(shop);
    expect(restRequestCtx.client.get).toBeDefined();

    expect(gqlRequestCtx).toBeDefined();
    expect(gqlRequestCtx.session.shop).toBe(shop);
    expect(gqlRequestCtx.client.query).toBeDefined();
  });

  it('returns an object with the appropriate client and session for online && embedded apps', async () => {
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
      sessionId: createGetJwtSessionId(shopify.config)(shop, jwtPayload.sub),
      isOnline: true,
      accessToken: 'gimme-access',
    });

    const restRequestCtx = (await shopify.session.withSession({
      clientType: ClientType.Rest,
      isOnline: true,
      rawRequest: request,
    })) as RestWithSession;

    const gqlRequestCtx = (await shopify.session.withSession({
      clientType: ClientType.Graphql,
      isOnline: true,
      rawRequest: request,
    })) as GraphqlWithSession;

    expect(restRequestCtx).toBeDefined();
    expect(restRequestCtx.session.shop).toBe(shop);
    expect(restRequestCtx.client.get).toBeDefined();

    expect(gqlRequestCtx).toBeDefined();
    expect(gqlRequestCtx.session.shop).toBe(shop);
    expect(gqlRequestCtx.client.query).toBeDefined();
  });
});
