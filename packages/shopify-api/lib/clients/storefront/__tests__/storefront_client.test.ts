import {FetchError} from 'node-fetch';

import {queueError, queueMockResponse} from '../../../__tests__/test-helper';
import {testConfig} from '../../../__tests__/test-config';
import {
  ApiVersion,
  LATEST_API_VERSION,
  LogSeverity,
  ShopifyHeader,
} from '../../../types';
import {Session} from '../../../session/session';
import {JwtPayload} from '../../../session/types';
import {HttpRequestError, MissingRequiredArgument} from '../../../error';
import {shopifyApi} from '../../../index';

const domain = 'test-shop.myshopify.io';
const QUERY = `
{
  shop {
    name
  }
}
`;

const successResponse = {
  data: {
    shop: {
      name: 'Shoppity Shop',
    },
  },
};
const accessToken = 'dangit';
let session: Session;

describe('Storefront GraphQL client', () => {
  beforeEach(() => {
    const jwtPayload: JwtPayload = {
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

    session = new Session({
      id: `test-shop.myshopify.io_${jwtPayload.sub}`,
      shop: domain,
      state: 'state',
      isOnline: true,
      accessToken,
    });
  });

  it('can return response from specific access token', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Storefront({session});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.request(QUERY)).resolves.toEqual(
      expect.objectContaining(successResponse),
    );

    expect({
      method: 'POST',
      domain,
      path: `/api/${shopify.config.apiVersion}/graphql.json`,
      data: {query: QUERY},
      headers: {
        [ShopifyHeader.StorefrontPrivateToken]: session.accessToken,
      },
    }).toMatchMadeHttpRequest();
  });

  it('can return response from private access token in config setting', async () => {
    const shopify = shopifyApi(
      testConfig({
        isCustomStoreApp: true,
        adminApiAccessToken: 'dummy_token',
        privateAppStorefrontAccessToken: 'private_token',
      }),
    );

    const customSession = shopify.session.customAppSession(session.shop);
    const client = new shopify.clients.Storefront({session: customSession});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.request(QUERY)).resolves.toEqual(
      expect.objectContaining(successResponse),
    );

    expect({
      method: 'POST',
      domain,
      path: `/api/${shopify.config.apiVersion}/graphql.json`,
      data: {query: QUERY},
      headers: {
        [ShopifyHeader.StorefrontPrivateToken]: 'private_token',
      },
    }).toMatchMadeHttpRequest();
  });

  it('fails when missing privateAppStorefrontAccessToken, if isCustomStoreApp is true', async () => {
    const shopify = shopifyApi(
      testConfig({isCustomStoreApp: true, adminApiAccessToken: 'dummy_token'}),
    );

    const customSession = shopify.session.customAppSession(session.shop);
    expect(
      () => new shopify.clients.Storefront({session: customSession}),
    ).toThrow(MissingRequiredArgument);
  });

  it('sets specific SF API headers', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Storefront({session});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.request(QUERY)).resolves.toEqual(
      expect.objectContaining(successResponse),
    );

    expect({
      method: 'POST',
      domain,
      path: `/api/${shopify.config.apiVersion}/graphql.json`,
      data: {query: QUERY},
      headers: {
        [ShopifyHeader.StorefrontPrivateToken]: session.accessToken,
        [ShopifyHeader.StorefrontSDKVariant]: 'storefront-api-client',
        [ShopifyHeader.StorefrontSDKVersion]: expect.any(String),
      },
    }).toMatchMadeHttpRequest();
  });

  it('allows overriding the API version', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Storefront({
      session,
      apiVersion: '2020-01' as any as ApiVersion,
    });

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.request(QUERY)).resolves.toEqual(
      expect.objectContaining(successResponse),
    );

    expect({
      method: 'POST',
      domain,
      path: `/api/2020-01/graphql.json`,
      data: {query: QUERY},
      headers: {
        [ShopifyHeader.StorefrontPrivateToken]: session.accessToken,
      },
    }).toMatchMadeHttpRequest();

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Debug,
      expect.stringContaining(
        `Storefront client overriding default API version ${LATEST_API_VERSION} with 2020-01`,
      ),
    );
  });

  it('throws error if no response is available', async () => {
    const shopify = shopifyApi(testConfig());

    const client = new shopify.clients.Storefront({
      session,
      apiVersion: '2020-01' as any as ApiVersion,
    });

    const fetchError = new FetchError(
      `uri requested responds with an invalid redirect URL: http://test.com`,
      'invalid-redirect',
    );
    queueError(fetchError);
    queueError(fetchError);

    const request = async () => {
      await client.request(QUERY);
    };

    await expect(request).rejects.toThrow(HttpRequestError);
    await expect(request).rejects.toThrow('invalid redirect');
  });
});
