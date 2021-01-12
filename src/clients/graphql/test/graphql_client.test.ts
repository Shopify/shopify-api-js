import '../../../test/test_helper';
import {ShopifyHeader} from '../../../types';
import {assertHttpRequest} from '../../test/test_helper';
import {GraphqlClient} from '../graphql_client';

const DOMAIN = 'shop.myshopify.com';
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

describe('GraphQL client', () => {
  it('can return response', async () => {
    const client: GraphqlClient = new GraphqlClient(DOMAIN, 'bork');
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest('POST', DOMAIN, '/admin/api/unstable/graphql.json', {}, QUERY);
  });

  it('merges custom headers with default', async () => {
    const client: GraphqlClient = new GraphqlClient(DOMAIN, 'bork');
    const customHeader: Record<string, string> = {
      'X-Glib-Glob': 'goobers',
    };

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.query({extraHeaders: customHeader, data: QUERY})).resolves.toEqual(buildExpectedResponse(successResponse));

    customHeader[ShopifyHeader.AccessToken] = 'bork';
    assertHttpRequest('POST', DOMAIN, '/admin/api/unstable/graphql.json', customHeader, QUERY);
  });
});

function buildExpectedResponse(obj: unknown) {
  const expectedResponse = {
    body: obj,
    headers: expect.objectContaining({}),
  };
  return expect.objectContaining(expectedResponse);
}
