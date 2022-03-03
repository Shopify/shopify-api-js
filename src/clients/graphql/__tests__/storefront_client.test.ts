import {ShopifyHeader} from '../../../base_types';
import {StorefrontClient} from '../storefront_client';
import {Context} from '../../../context';

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

  it('can return response from Context private app setting', async () => {
    Context.IS_PRIVATE_APP = true;
    Context.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN = 'private_token';
    Context.initialize(Context);

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
