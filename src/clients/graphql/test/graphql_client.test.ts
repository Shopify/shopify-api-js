import '../../../test/test_helper';
import {ShopifyHeader} from '../../../base_types';
import {assertHttpRequest} from '../../http_client/test/test_helper';
import {GraphqlClient} from '../graphql_client';
import {Context} from '../../../context';
import * as ShopifyErrors from '../../../error';

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
    assertHttpRequest({
      method: 'POST',
      domain: DOMAIN,
      path: '/admin/api/unstable/graphql.json',
      data: QUERY,
    });
  });

  it('merges custom headers with default', async () => {
    const client: GraphqlClient = new GraphqlClient(DOMAIN, 'bork');
    const customHeader: Record<string, string> = {
      'X-Glib-Glob': 'goobers',
    };

    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    await expect(client.query({extraHeaders: customHeader, data: QUERY})).resolves.toEqual(buildExpectedResponse(successResponse));

    customHeader[ShopifyHeader.AccessToken] = 'bork';
    assertHttpRequest({
      method: 'POST',
      domain: DOMAIN,
      path: '/admin/api/unstable/graphql.json',
      headers: customHeader,
      data: QUERY,
    });
  });

  it('adapts to private app requests', async () => {
    Context.IS_PRIVATE_APP = true;
    Context.initialize(Context);

    const client: GraphqlClient = new GraphqlClient(DOMAIN);
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));

    const customHeaders: Record<string, string> = {};
    customHeaders[ShopifyHeader.AccessToken] = 'test_secret_key';

    await expect(client.query({data: QUERY})).resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest({
      method: 'POST',
      domain: DOMAIN,
      path: '/admin/api/unstable/graphql.json',
      data: QUERY,
      headers: customHeaders,
    });
  });

  it('fails to instantiate without access token', () => {
    expect(() => new GraphqlClient(DOMAIN)).toThrow(ShopifyErrors.MissingRequiredArgument);
  });
});

function buildExpectedResponse(obj: unknown) {
  const expectedResponse = {
    body: obj,
    headers: expect.objectContaining({}),
  };
  return expect.objectContaining(expectedResponse);
}
