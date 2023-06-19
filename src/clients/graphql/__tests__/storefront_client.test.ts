import {ShopifyHeader} from '../../../base-types';
import {StorefrontClient} from '../storefront_client';
import {Context} from '../../../context';
import {setAbstractFetchFunc, Response} from '../../../runtime/http';
import * as mockAdapter from '../../../adapters/mock';

setAbstractFetchFunc(mockAdapter.abstractFetch);

const DOMAIN = 'shop.myshopify.io';
const QUERY = `
{
  shop {
    name
  }
}
`;

const successResponse = JSON.stringify({
  data: {
    shop: {
      name: 'Shoppity Shop',
    },
  },
});

describe('Storefront GraphQL client', () => {
  it('can return response from specific access token', async () => {
    const client: StorefrontClient = new StorefrontClient(DOMAIN, 'bork');

    queueMockResponse(successResponse);

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

    queueMockResponse(successResponse);

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

function buildExpectedResponse(body: string): Response {
  const expectedResponse: Partial<Response> = {
    headers: expect.objectContaining({}),
    body: JSON.parse(body),
  };

  return expect.objectContaining(expectedResponse);
}

function queueMockResponse(body: string, partial: Partial<Response> = {}) {
  mockAdapter.queueResponse({
    statusCode: 200,
    statusText: 'OK',
    headers: {},
    ...partial,
    body,
  });
}
