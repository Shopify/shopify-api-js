import {ShopifyHeader} from '../../../base-types';
import {GraphqlClient} from '../graphql_client';
import {Context} from '../../../context';
import {setAbstractFetchFunc, Response} from '../../../runtime/http';
import Shopify from '../../../adapters/node';
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

describe('GraphQL client', () => {
  it('can return response', async () => {
    const client: GraphqlClient = new GraphqlClient(DOMAIN, 'bork');
    queueMockResponse(successResponse);

    const response = await client.query({data: QUERY});

    expect(response).toEqual(buildExpectedResponse(successResponse));
    expect({
      method: 'POST',
      domain: DOMAIN,
      path: '/admin/api/unstable/graphql.json',
      data: QUERY,
    }).toMatchMadeHttpRequest();
  });

  it('merges custom headers with default', async () => {
    const client: GraphqlClient = new GraphqlClient(DOMAIN, 'bork');
    const customHeader: {[key: string]: string} = {
      'X-Glib-Glob': 'goobers',
    };

    queueMockResponse(successResponse);

    await expect(
      client.query({extraHeaders: customHeader, data: QUERY}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));

    customHeader[ShopifyHeader.AccessToken] = 'bork';
    expect({
      method: 'POST',
      domain: DOMAIN,
      path: '/admin/api/unstable/graphql.json',
      headers: customHeader,
      data: QUERY,
    }).toMatchMadeHttpRequest();
  });

  it('adapts to private app requests', async () => {
    Context.IS_PRIVATE_APP = true;
    Context.initialize(Context);

    const client: GraphqlClient = new GraphqlClient(DOMAIN);
    queueMockResponse(successResponse);

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    const customHeaders: {[key: string]: string} = {};
    customHeaders[ShopifyHeader.AccessToken] = 'test_secret_key';

    expect({
      method: 'POST',
      domain: DOMAIN,
      path: '/admin/api/unstable/graphql.json',
      data: QUERY,
      headers: customHeaders,
    }).toMatchMadeHttpRequest();
  });

  it('fails to instantiate without access token', () => {
    expect(() => new GraphqlClient(DOMAIN)).toThrow(
      Shopify.Errors.MissingRequiredArgument,
    );
  });

  it('can handle queries with variables', async () => {
    const client: GraphqlClient = new GraphqlClient(DOMAIN, 'bork');
    const queryWithVariables = {
      query: `query FirstTwo($first: Int) {
        products(first: $first) {
          edges {
            node {
              id
          }
        }
      }
    }`,
      variables: `{
        'first': 2,
      }`,
    };
    const expectedResponse = JSON.stringify({
      data: {
        products: {
          edges: [
            {
              node: {
                id: 'foo',
              },
            },
            {
              node: {
                id: 'bar',
              },
            },
          ],
        },
      },
    });

    queueMockResponse(expectedResponse);

    await expect(client.query({data: queryWithVariables})).resolves.toEqual(
      buildExpectedResponse(expectedResponse),
    );

    expect({
      method: 'POST',
      domain: DOMAIN,
      path: '/admin/api/unstable/graphql.json',
      headers: {
        'Content-Length': '219',
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': 'bork',
      },
      data: JSON.stringify(queryWithVariables),
    }).toMatchMadeHttpRequest();
  });
});

function queueMockResponse(body: string, partial: Partial<Response> = {}) {
  mockAdapter.queueResponse({
    statusCode: 200,
    statusText: 'OK',
    headers: {},
    ...partial,
    body,
  });
}

function buildExpectedResponse(body: string): Response {
  const expectedResponse: Partial<Response> = {
    headers: expect.objectContaining({}),
    body: JSON.parse(body),
  };

  return expect.objectContaining(expectedResponse);
}
