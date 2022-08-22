import {ShopifyHeader} from '../../../base-types';
import {StorefrontClient} from '../storefront_client';
import {config, setConfig} from '../../../config';

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

describe('Storefront GraphQL client', () => {
  it('can return response from specific access token', async () => {
    const client: StorefrontClient = new StorefrontClient(DOMAIN, 'bork');

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    const headers: {[key: string]: unknown} = {};
    headers[ShopifyHeader.StorefrontAccessToken] = 'bork';
    expect({
      method: 'POST',
      domain: DOMAIN,
      path: '/api/unstable/graphql.json',
      data: QUERY,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('can return response from config private app setting', async () => {
    config.IS_PRIVATE_APP = true;
    config.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN = 'private_token';
    setConfig(config);

    const client: StorefrontClient = new StorefrontClient(DOMAIN);

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    const headers: {[key: string]: unknown} = {};
    headers[ShopifyHeader.StorefrontAccessToken] = 'private_token';
    expect({
      method: 'POST',
      domain: DOMAIN,
      path: '/api/unstable/graphql.json',
      data: QUERY,
      headers,
    }).toMatchMadeHttpRequest();
  });
});

function buildExpectedResponse(obj: unknown) {
  const expectedResponse = {
    body: obj,
    headers: expect.objectContaining({}),
  };
  return expect.objectContaining(expectedResponse);
}
