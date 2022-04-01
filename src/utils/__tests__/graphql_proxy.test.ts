import express, {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import request from 'supertest';

import * as mockAdapter from '../../adapters/mock';
import {setAbstractFetchFunc, Request, Response} from '../../runtime/http';
import {Session} from '../../auth/session';
import {InvalidSession, SessionNotFound} from '../../error';
import graphqlProxy from '../graphql_proxy';
import {Context} from '../../context';
import {JwtPayload} from '../decode-session-token';
import {signJWT} from '../setup-jest';

setAbstractFetchFunc(mockAdapter.abstractFetch);

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
let token = '';

describe('GraphQL proxy with session', () => {
  const app = express();
  app.post('/proxy', async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const internalResponse = {
        statusCode: 200,
        statusText: 'OK',
      } as Response;
      const response = await graphqlProxy(
        await convertRequest(req),
        internalResponse,
      );
      internalResponse.body = JSON.stringify(response.body);
      convertResponse(internalResponse, res);
    } catch (err) {
      res.status(400);
      res.send(JSON.stringify(err.message));
    }
  });

  beforeEach(async () => {
    mockAdapter.reset();
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);
    const jwtPayload: JwtPayload = {
      iss: 'https://shop.myshopify.com/admin',
      dest: 'https://shop.myshopify.com',
      aud: Context.API_KEY,
      sub: '1',
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: '4321',
      sid: 'abc123',
    };

    const session = new Session(
      `shop.myshopify.com_${jwtPayload.sub}`,
      shop,
      'state',
      true,
    );
    session.accessToken = accessToken;
    await Context.SESSION_STORAGE.storeSession(session);
    token = await signJWT(jwtPayload);
  });

  it('can forward query and return response', async () => {
    queueMockResponse(JSON.stringify(successResponse));
    queueMockResponse(JSON.stringify(successResponse));

    const firstResponse = await request(app)
      .post('/proxy')
      .set('authorization', `Bearer ${token}`)
      .send(shopQuery)
      .expect(200);

    expect(JSON.parse(firstResponse.text)).toEqual(successResponse);

    const nextResponse = await request(app)
      .post('/proxy')
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
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);
    const jwtPayload: JwtPayload = {
      iss: 'https://test-shop.myshopify.io/admin',
      dest: 'https://test-shop.myshopify.io',
      aud: Context.API_KEY,
      sub: '1',
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: '4321',
      sid: 'abc123',
    };

    const token = await signJWT(jwtPayload);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any as Request;
    const res = {} as Response;
    const session = new Session(
      `test-shop.myshopify.io_${jwtPayload.sub}`,
      shop,
      'state',
      true,
    );
    Context.SESSION_STORAGE.storeSession(session);

    await expect(graphqlProxy(req, res)).rejects.toThrow(InvalidSession);
  });

  it('throws an error if no session', async () => {
    const req = {headers: {}} as Request;
    const res = {} as Response;
    await expect(graphqlProxy(req, res)).rejects.toThrow(SessionNotFound);
  });
});

async function convertRequest(req: ExpressRequest): Promise<Request> {
  const body = await new Promise<string>((resolve, reject) => {
    let str = '';
    req.on('data', (chunk) => {
      str += chunk.toString();
    });
    req.on('error', (error) => reject(error));
    req.on('end', () => resolve(str));
  });
  return {
    headers: req.headers as any,
    method: req.method,
    url: req.url,
    body,
  };
}

function convertResponse(
  internalResponse: Response,
  response: ExpressResponse,
) {
  response.statusCode = internalResponse.statusCode;
  response.statusMessage = internalResponse.statusText;
  Object.assign(response.header, internalResponse.headers);
  response.end(internalResponse.body);
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
