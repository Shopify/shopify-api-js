import {shopify, queueMockResponse} from '../../../__tests__/test-helper';
import {
  ApiVersion,
  LATEST_API_VERSION,
  LogSeverity,
  ShopifyHeader,
} from '../../../types';
import {Session} from '../../../session/session';
import {JwtPayload} from '../../../session/types';
import {SHOPIFY_API_LIBRARY_VERSION} from '../../../version';

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
const storefrontAccessToken = 'storefrontAccessToken-dangit';
let session: Session;

describe('Storefront GraphQL client', () => {
  beforeEach(() => {
    const jwtPayload: JwtPayload = {
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

    session = new Session({
      id: `test-shop.myshopify.io_${jwtPayload.sub}`,
      shop: domain,
      state: 'state',
      isOnline: true,
      accessToken,
    });
  });

  it('can return response from specific access token', async () => {
    const client = new shopify.clients.Storefront({
      domain: session.shop,
      storefrontAccessToken,
    });

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    expect({
      method: 'POST',
      domain,
      path: `/api/${shopify.config.apiVersion}/graphql.json`,
      data: QUERY,
      headers: {
        [ShopifyHeader.StorefrontAccessToken]: storefrontAccessToken,
      },
    }).toMatchMadeHttpRequest();
  });

  it('can return response from config private app setting', async () => {
    shopify.config.isCustomStoreApp = true;
    shopify.config.privateAppStorefrontAccessToken = 'private_token';

    const client = new shopify.clients.Storefront({
      domain: session.shop,
      storefrontAccessToken,
    });

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    expect({
      method: 'POST',
      domain,
      path: `/api/${shopify.config.apiVersion}/graphql.json`,
      data: QUERY,
      headers: {
        [ShopifyHeader.StorefrontAccessToken]: 'private_token',
      },
    }).toMatchMadeHttpRequest();
  });

  it('sets specific SF API headers', async () => {
    const client = new shopify.clients.Storefront({
      domain: session.shop,
      storefrontAccessToken,
    });

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    expect({
      method: 'POST',
      domain,
      path: `/api/${shopify.config.apiVersion}/graphql.json`,
      data: QUERY,
      headers: {
        [ShopifyHeader.StorefrontAccessToken]: storefrontAccessToken,
        [ShopifyHeader.StorefrontSDKVariant]: 'shopify-api-library',
        [ShopifyHeader.StorefrontSDKVersion]: SHOPIFY_API_LIBRARY_VERSION,
      },
    }).toMatchMadeHttpRequest();
  });

  it('allows overriding the API version', async () => {
    const client = new shopify.clients.Storefront({
      domain: session.shop,
      storefrontAccessToken,
      apiVersion: '2020-01' as any as ApiVersion,
    });

    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    expect({
      method: 'POST',
      domain,
      path: `/api/2020-01/graphql.json`,
      data: QUERY,
      headers: {
        [ShopifyHeader.StorefrontAccessToken]: storefrontAccessToken,
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

function buildExpectedResponse(obj: unknown) {
  const expectedResponse = {
    body: obj,
    headers: expect.objectContaining({}),
  };
  return expect.objectContaining(expectedResponse);
}
