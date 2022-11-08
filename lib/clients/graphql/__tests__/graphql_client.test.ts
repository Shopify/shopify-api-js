import * as ShopifyErrors from '../../../error';
import {ShopifyHeader} from '../../../types';
import {queueMockResponse, shopify} from '../../../__tests__/test-helper';
import {Session} from '../../../session/session';
import {JwtPayload} from '../../../session/types';

const domain = 'test-shop.myshopify.io';
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

const accessToken = 'dangit';
let session: Session;
let jwtPayload: JwtPayload;

describe('GraphQL client', () => {
  beforeEach(() => {
    jwtPayload = {
      iss: 'https://test-shop.myshopify.io/admin',
      dest: 'https://test-shop.myshopify.io',
      aud: shopify.config.apiKey,
      sub: '1',
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: '4321',
      sid: 'abc123',
    };

    session = new Session({
      id: `test-shop.myshopify.io_${jwtPayload.sub}`,
      shop: domain,
      state: 'state',
      isOnline: true,
      accessToken,
    });
  });

  it('can return response', async () => {
    const client = new shopify.clients.Graphql({session});
    queueMockResponse(JSON.stringify(successResponse));

    const response = await client.query({data: QUERY});

    expect(response).toEqual(buildExpectedResponse(successResponse));
    expect({
      method: 'POST',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
      data: QUERY,
    }).toMatchMadeHttpRequest();
  });

  it('merges custom headers with default', async () => {
    const client = new shopify.clients.Graphql({session});
    const customHeader: {[key: string]: string} = {
      'X-Glib-Glob': 'goobers',
    };

    queueMockResponse(JSON.stringify(successResponse));

    await expect(
      client.query({extraHeaders: customHeader, data: QUERY}),
    ).resolves.toEqual(buildExpectedResponse(successResponse));

    customHeader[ShopifyHeader.AccessToken] = accessToken;
    expect({
      method: 'POST',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
      headers: customHeader,
      data: QUERY,
    }).toMatchMadeHttpRequest();
  });

  it('adapts to private app requests', async () => {
    shopify.config.isPrivateApp = true;

    const client = new shopify.clients.Graphql({session});
    queueMockResponse(JSON.stringify(successResponse));

    await expect(client.query({data: QUERY})).resolves.toEqual(
      buildExpectedResponse(successResponse),
    );

    const customHeaders: {[key: string]: string} = {};
    customHeaders[ShopifyHeader.AccessToken] = shopify.config.apiSecretKey;

    expect({
      method: 'POST',
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
      data: QUERY,
      headers: customHeaders,
    }).toMatchMadeHttpRequest();

    shopify.config.isPrivateApp = false;
  });

  it('fails to instantiate without access token', () => {
    const sessionWithoutAccessToken = new Session({
      id: `test-shop.myshopify.io_${jwtPayload.sub}`,
      shop: domain,
      state: 'state',
      isOnline: true,
    });

    expect(
      () => new shopify.clients.Graphql({session: sessionWithoutAccessToken}),
    ).toThrow(ShopifyErrors.MissingRequiredArgument);
  });

  it('can handle queries with variables', async () => {
    const client = new shopify.clients.Graphql({session});
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
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
      headers: {
        'Content-Length': 219,
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      data: JSON.stringify(queryWithVariables),
    }).toMatchMadeHttpRequest();
  });

  it('throws error when response contains an errors field', async () => {
    const client = new shopify.clients.Graphql({session});
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
      domain,
      path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
      headers: {
        'Content-Length': 156,
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
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
