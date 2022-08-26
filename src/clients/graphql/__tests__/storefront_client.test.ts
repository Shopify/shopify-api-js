import {createStorefrontClientClass} from '../storefront_client';
import {
  ShopifyHeader,
  ConfigInterface,
  LATEST_API_VERSION,
} from '../../../base-types';
import {AuthScopes} from '../../../auth/scopes';
import {MemorySessionStorage} from '../../../auth/session/storage/memory';

const DOMAIN = 'shop.myshopify.io';
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

const config: ConfigInterface = {
  apiKey: 'test-api-key',
  apiSecretKey: 'test-api-secret-key',
  scopes: new AuthScopes(['read_products', 'write_products']),
  hostName: 'my.platform.net',
  hostScheme: 'https',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  sessionStorage: new MemorySessionStorage(),
};
const StorefrontClientClass = createStorefrontClientClass(config);

describe('Storefront GraphQL client', () => {
  it('can return response from specific access token', async () => {
    const client = new StorefrontClientClass({
      domain: DOMAIN,
      accessToken: 'bork',
    });

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    const headers: {[key: string]: unknown} = {};
    headers[ShopifyHeader.StorefrontAccessToken] = 'bork';
    expect({
      method: 'POST',
      domain: DOMAIN,
      path: `/api/${config.apiVersion}/graphql.json`,
      data: QUERY,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('can return response from config private app setting', async () => {
    config.isPrivateApp = true;
    config.privateAppStorefrontAccessToken = 'private_token';

    const client = new StorefrontClientClass({domain: DOMAIN});

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    const headers: {[key: string]: unknown} = {};
    headers[ShopifyHeader.StorefrontAccessToken] = 'private_token';
    expect({
      method: 'POST',
      domain: DOMAIN,
      path: `/api/${config.apiVersion}/graphql.json`,
      data: QUERY,
      headers,
    }).toMatchMadeHttpRequest();
  });

  config.isPrivateApp = false;
  config.privateAppStorefrontAccessToken = undefined;
});

function buildExpectedResponse(obj: unknown) {
  const expectedResponse = {
    body: obj,
    headers: expect.objectContaining({}),
  };
  return expect.objectContaining(expectedResponse);
}
