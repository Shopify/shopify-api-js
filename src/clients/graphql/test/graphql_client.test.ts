/* eslint @typescript-eslint/no-var-requires: "off" */
import '../../../test/test_helper';
import { assertHttpRequest } from '../../test/test_helper';
import { GraphqlClient } from '../graphql_client';

const DOMAIN = 'shop.myshopify.com';
const QUERY = `
{
  shop {
    name
  }
}
`

const successResponse = {
  data: {
    shop: {
      name: 'Shoppity Shop'
    }
  }
};

describe('GraphQL client', () => {
  it('can return response', async () => {
    const client: GraphqlClient = new GraphqlClient(DOMAIN, 'bork');
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.query({ data: QUERY })).resolves.toEqual(successResponse);
    assertHttpRequest('POST', DOMAIN, '/admin/api/unstable/graphql.json', {}, QUERY);
  });
});