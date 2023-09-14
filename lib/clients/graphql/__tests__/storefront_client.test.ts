import {
  shopify,
  queueMockResponse,
  testIfLibraryVersionIsAtLeast,
} from '../../../__tests__/test-helper';
import {
  ApiVersion,
  LATEST_API_VERSION,
  LogSeverity,
  ShopifyHeader,
} from '../../../types';
import {Session} from '../../../session/session';
import {JwtPayload} from '../../../session/types';
import {SHOPIFY_API_LIBRARY_VERSION} from '../../../version';
import {MissingRequiredArgument} from '../../../error';

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
/** @deprecated This should no longer be used */
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

  it('can return response from specific access token, using the deprecated params', async () => {
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

  it('can return response from specific access token', async () => {
    const client = new shopify.clients.Storefront({session});

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
        [ShopifyHeader.StorefrontPrivateToken]: session.accessToken,
      },
    }).toMatchMadeHttpRequest();
  });

  it('can return response from private access token in config setting', async () => {
    shopify.config.isCustomStoreApp = true;
    shopify.config.privateAppStorefrontAccessToken = 'private_token';

    const customSession = shopify.session.customAppSession(session.shop);
    const client = new shopify.clients.Storefront({session: customSession});

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
        [ShopifyHeader.StorefrontPrivateToken]: 'private_token',
      },
    }).toMatchMadeHttpRequest();
  });

  testIfLibraryVersionIsAtLeast(
    '8.0.0',
    'fails without privateAppStorefrontAccessToken if isCustomStoreApp is true',
    async () => {
      shopify.config.isCustomStoreApp = true;

      const customSession = shopify.session.customAppSession(session.shop);
      const client = new shopify.clients.Storefront({session: customSession});

      await expect(client.query({data: QUERY})).rejects.toThrow(
        MissingRequiredArgument,
      );
    },
  );

  it('does not fail when missing privateAppStorefrontAccessToken, if isCustomStoreApp is true', async () => {
    shopify.config.isCustomStoreApp = true;

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

  it('sets specific SF API headers', async () => {
    const client = new shopify.clients.Storefront({session});

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
        [ShopifyHeader.StorefrontPrivateToken]: session.accessToken,
        [ShopifyHeader.StorefrontSDKVariant]: 'shopify-api-library',
        [ShopifyHeader.StorefrontSDKVersion]: SHOPIFY_API_LIBRARY_VERSION,
      },
    }).toMatchMadeHttpRequest();
  });

  it('allows overriding the API version', async () => {
    const client = new shopify.clients.Storefront({
      session,
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

function buildExpectedResponse(obj: unknown) {
  const expectedResponse = {
    body: obj,
    headers: expect.objectContaining({}),
  };
  return expect.objectContaining(expectedResponse);
}
