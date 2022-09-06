import {shopify} from '../../../__tests__/test-helper';
import {ShopifyHeader} from '../../../base-types';

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
    const client = new shopify.clients.Storefront({
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
      path: `/api/${shopify.config.apiVersion}/graphql.json`,
      data: QUERY,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('can return response from config private app setting', async () => {
    shopify.config.isPrivateApp = true;
    shopify.config.privateAppStorefrontAccessToken = 'private_token';

    const client = new shopify.clients.Storefront({domain: DOMAIN});

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    const headers: {[key: string]: unknown} = {};
    headers[ShopifyHeader.StorefrontAccessToken] = 'private_token';
    expect({
      method: 'POST',
      domain: DOMAIN,
      path: `/api/${shopify.config.apiVersion}/graphql.json`,
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
