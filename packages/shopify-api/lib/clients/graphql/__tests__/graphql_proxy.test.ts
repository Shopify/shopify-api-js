import express, {Request, Response} from 'express';
import request from 'supertest';

import {
  queueMockResponses,
  shopify,
  signJWT,
} from '../../../__tests__/test-helper';
import {Session} from '../../../session/session';
import {InvalidSession} from '../../../error';
import {JwtPayload} from '../../../session/types';
import {canonicalizeHeaders, NormalizedRequest} from '../../../../runtime/http';

const successResponse = {
  data: {
    shop: {
      name: 'Shop',
    },
  },
};
const shopQuery = `{
  shop {
    name
  }
}`;
const objectQuery = {
  query: `{
    query {
      with {
        variable
      }
    }
  }`,
  variables: `{
    foo: bar
  }`,
};
const shop = 'shop.myshopify.com';
const accessToken = 'dangit';
let session: Session;
let token = '';

describe('GraphQL proxy with session', () => {
  const app = express();
  app.use(express.text());
  app.use(express.json());
  app.post('/proxy', async (req: Request, res: Response) => {
    try {
      // Convert the request to a normalized request here because we're using the mock adapter, rather than the node one
      const request: NormalizedRequest = {
        headers: canonicalizeHeaders({...req.headers} as any),
        method: req.method ?? 'GET',
        url: req.url!,
        body: req.body,
      };

      const testResponse = await shopify.clients.graphqlProxy({
        rawBody: request.body!,
        session,
      });

      res.send(testResponse.body);
    } catch (err) {
      res.status(400);
      res.send(JSON.stringify(err.message));
    }
  });

  beforeEach(async () => {
    shopify.config.isEmbeddedApp = true;

    const jwtPayload: JwtPayload = {
      iss: 'https://shop.myshopify.com/admin',
      dest: 'https://shop.myshopify.com',
      aud: shopify.config.apiKey,
      sub: '1',
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: '4321',
      sid: 'abc123',
    };

    session = new Session({
      id: `shop.myshopify.com_${jwtPayload.sub}`,
      shop,
      state: 'state',
      isOnline: true,
      accessToken,
    });
    token = await signJWT(shopify.config.apiSecretKey, jwtPayload);
  });

  it('can forward query and return response', async () => {
    queueMockResponses(
      [JSON.stringify(successResponse)],
      [JSON.stringify(successResponse)],
    );

    const firstResponse = await request(app)
      .post('/proxy')
      .set('content-type', 'text/plain')
      .set('authorization', `Bearer ${token}`)
      .send(shopQuery)
      .expect(200);

    expect(JSON.parse(firstResponse.text)).toEqual(successResponse);

    const nextResponse = await request(app)
      .post('/proxy')
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .send(objectQuery)
      .expect(200);

    expect(JSON.parse(nextResponse.text)).toEqual(successResponse);
  });

  it('rejects if no query', async () => {
    const response = await request(app)
      .post('/proxy')
      .set('authorization', `Bearer ${token}`)
      .expect(400);

    expect(JSON.parse(response.text)).toEqual('Query missing.');
  });
});

describe('GraphQL proxy', () => {
  it('throws an error if no token', async () => {
    shopify.config.isEmbeddedApp = true;

    const jwtPayload: JwtPayload = {
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

    const session = new Session({
      id: `test-shop.myshopify.io_${jwtPayload.sub}`,
      shop,
      state: 'state',
      isOnline: true,
    });

    await expect(
      shopify.clients.graphqlProxy({
        rawBody: '',
        session,
      }),
    ).rejects.toThrow(InvalidSession);
  });
});
