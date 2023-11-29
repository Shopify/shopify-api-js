import {queueMockResponse} from '../../../__tests__/test-helper';
import {testConfig} from '../../../__tests__/test-config';
import {
  ApiVersion,
  LATEST_API_VERSION,
  LogSeverity,
  ShopifyHeader,
} from '../../../types';
import {Session} from '../../../session/session';
import {JwtPayload} from '../../../session/types';
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

  it('can return response from specific access token with fetch', async () => {
    const shopify = shopifyApi(testConfig());

    const client = shopify.clients.storefront({session});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.fetch(QUERY)).resolves.toMatchResponse({
      body: successResponse,
    });

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

  it('can return response from specific access token with request', async () => {
    const shopify = shopifyApi(testConfig());

    const client = shopify.clients.storefront({session});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.request(QUERY)).resolves.toMatchObject(successResponse);

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
    const client = shopify.clients.storefront({session: customSession});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.fetch(QUERY)).resolves.toMatchResponse({
      body: successResponse,
    });

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
    expect(() => shopify.clients.storefront({session: customSession})).toThrow(
      'Storefront API Client: a public or private access token must be provided',
    );
  });

  it('sets specific SF API headers', async () => {
    const shopify = shopifyApi(testConfig());

    const client = shopify.clients.storefront({session});

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.fetch(QUERY)).resolves.toMatchResponse({
      body: successResponse,
    });

    expect({
      method: 'POST',
      domain,
      path: `/api/${shopify.config.apiVersion}/graphql.json`,
      data: {query: QUERY},
      headers: {
        [ShopifyHeader.StorefrontPrivateToken]: session.accessToken,
        [ShopifyHeader.StorefrontSDKVariant]: 'storefront-api-client',
        [ShopifyHeader.StorefrontSDKVersion]: expect.anything(),
      },
    }).toMatchMadeHttpRequest();
  });

  it('allows overriding the API version', async () => {
    const shopify = shopifyApi(testConfig());

    const client = shopify.clients.storefront({
      session,
      apiVersion: '2020-01' as any as ApiVersion,
    });

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.fetch(QUERY)).resolves.toMatchResponse({
      body: successResponse,
    });

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
});
