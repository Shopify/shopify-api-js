import http from 'http';

import jwt from 'jsonwebtoken';
import express, {Request, Response} from 'express';
import request from 'supertest';

import {Session} from '../../auth/session';
import {InvalidSession, SessionNotFound} from '../../error';
import graphqlProxy from '../graphql_proxy';
import {Context} from '../../context';
import {JwtPayload} from '../decode-session-token';

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
  app.post('/proxy', async (req: Request, res: Response) => {
    try {
      const response = await graphqlProxy(req, res);
      res.send(response.body);
    } catch (err) {
      res.status(400);
      res.send(JSON.stringify(err.message));
    }
  });

  beforeEach(async () => {
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
    token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, {
      algorithm: 'HS256',
    });
  });

  it('can forward query and return response', async () => {
    fetchMock.mockResponses(
      JSON.stringify(successResponse),
      JSON.stringify(successResponse),
    );

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

    const token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, {
      algorithm: 'HS256',
    });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;
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
    const req = {headers: {}} as http.IncomingMessage;
    const res = {} as http.ServerResponse;
    await expect(graphqlProxy(req, res)).rejects.toThrow(SessionNotFound);
  });
});
