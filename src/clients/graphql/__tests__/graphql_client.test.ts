import * as ShopifyErrors from '../../../error';
import {ShopifyHeader} from '../../../base-types';
import {queueMockResponse, shopify} from '../../../__tests__/test-helper';

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

describe('GraphQL client', () => {
  it('can return response', async () => {
    const client = new shopify.clients.Graphql({
      domain: DOMAIN,
      accessToken: 'bork',
    });
    queueMockResponse(JSON.stringify(successResponse));

    const response = await client.query({data: QUERY});

    expect(response).toEqual(buildExpectedResponse(successResponse));
    expect({
      method: 'POST',
      domain: DOMAIN,
      path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
      data: QUERY,
    }).toMatchMadeHttpRequest();
  });

  it('merges custom headers with default', async () => {
    const client = new shopify.clients.Graphql({
      domain: DOMAIN,
      accessToken: 'bork',
    });
    const customHeader: {[key: string]: string} = {
      'X-Glib-Glob': 'goobers',
    };

    queueMockResponse(JSON.stringify(successResponse));

    await expect(
      client.query({extraHeaders: customHeader, data: QUERY}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));

    customHeader[ShopifyHeader.AccessToken] = 'bork';
    expect({
      method: 'POST',
      domain: DOMAIN,
      path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
      headers: customHeader,
      data: QUERY,
    }).toMatchMadeHttpRequest();
  });

  it('adapts to private app requests', async () => {
    shopify.config.isPrivateApp = true;

    const client = new shopify.clients.Graphql({domain: DOMAIN});
    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    const customHeaders: {[key: string]: string} = {};
    customHeaders[ShopifyHeader.AccessToken] = shopify.config.apiSecretKey;

    expect({
      method: 'POST',
      domain: DOMAIN,
      path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
      data: QUERY,
      headers: customHeaders,
    }).toMatchMadeHttpRequest();

    shopify.config.isPrivateApp = false;
  });

  it('fails to instantiate without access token', () => {
    expect(() => new shopify.clients.Graphql({domain: DOMAIN})).toThrow(
      ShopifyErrors.MissingRequiredArgument,
    );
  });

  it('can handle queries with variables', async () => {
    const client = new shopify.clients.Graphql({
      domain: DOMAIN,
      accessToken: 'bork',
    });
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
    const expectedResponse = {
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
    };

    queueMockResponse(JSON.stringify(expectedResponse));

    await expect(client.query({data: queryWithVariables})).resolves.toEqual(
      buildExpectedResponse(expectedResponse),
    );

    expect({
      method: 'POST',
      domain: DOMAIN,
      path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
      headers: {
        'Content-Length': 219,
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': 'bork',
      },
      data: JSON.stringify(queryWithVariables),
    }).toMatchMadeHttpRequest();
  });

  it('throws error when response contains an errors field', async () => {
    const client = new shopify.clients.Graphql({
      domain: DOMAIN,
      accessToken: 'bork',
    });
    const query = {
      query: `query getProducts {
        products {
          edges {
            node {
              id
            }
          }
        }
      }`,
    };

    const errorResponse = {
      data: null,
      errors: [
        {
          message: 'you must provide one of first or last',
          locations: [
            {
              line: 2,
              column: 3,
            },
          ],
          path: ['products'],
        },
      ],
      extensions: {
        cost: {
          requestedQueryCost: 2,
          actualQueryCost: 2,
          throttleStatus: {
            maximumAvailable: 1000,
            currentlyAvailable: 998,
            restoreRate: 50,
          },
        },
      },
    };

    queueMockResponse(JSON.stringify(errorResponse));

    await expect(() => client.query({data: query})).rejects.toThrow(
      new ShopifyErrors.GraphqlQueryError({
        message: 'GraphQL query returned errors',
        response: errorResponse,
      }),
    );

    expect({
      method: 'POST',
      domain: DOMAIN,
      path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
      headers: {
        'Content-Length': 156,
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': 'bork',
      },
      data: JSON.stringify(query),
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
