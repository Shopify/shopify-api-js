import '../../test/test_helper';

import http from 'http';
import jwt from 'jsonwebtoken';

import { Context } from '../../context';
import * as ShopifyErrors from '../../error';
import { Session } from '../../auth/session';
import { JwtPayload } from '../decode-session-token';
import deleteCurrentSession from '../delete-current-session';
import loadCurrentSession from '../load-current-session';

jest.mock('cookies');
import Cookies from 'cookies';

describe('deleteCurrenSession', () => {
  let jwtPayload: JwtPayload;
  beforeEach(() => {
    jwtPayload = {
      iss: 'test-shop.myshopify.io/admin',
      dest: 'test-shop.myshopify.io',
      aud: Context.API_KEY,
      sub: '1',
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: '4321',
      sid: 'abc123',
    };
  });

  it('finds and deletes the current session when using cookies', async () => {
    Context.initialize(Context);
    Context.IS_EMBEDDED_APP = false;

    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const cookieId = '1234-this-is-a-cookie-session-id';

    const session = new Session(cookieId);
    await expect(Context.storeSession(session)).resolves.toEqual(true);

    Cookies.prototype.get.mockImplementation(() => cookieId);

    await expect(deleteCurrentSession(req, res)).resolves.toBe(true);
    await expect(loadCurrentSession(req, res)).resolves.toBe(null);
  });

  it('finds and deletes the current session when using JWT', async () => {
    Context.initialize(Context);
    Context.IS_EMBEDDED_APP = true;

    const token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, { algorithm: 'HS256' });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const session = new Session(`test-shop.myshopify.io_${jwtPayload.sub}`);
    await expect(Context.storeSession(session)).resolves.toEqual(true);

    await expect(deleteCurrentSession(req, res)).resolves.toBe(true);
    await expect(loadCurrentSession(req, res)).resolves.toBe(null);
  });

  it('throws an error when no cookie is found', async () => {
    Context.initialize(Context);
    Context.IS_EMBEDDED_APP = false;

    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    Cookies.prototype.get.mockImplementation(() => null);

    await expect(() => deleteCurrentSession(req, res)).rejects.toBeInstanceOf(ShopifyErrors.SessionNotFound);
  });

  it('throws an error when authorization header is missing or not a bearer token', async () => {
    Context.initialize(Context);
    Context.IS_EMBEDDED_APP = true;

    let req = {
      headers: {},
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    await expect(() => deleteCurrentSession(req, res)).rejects.toBeInstanceOf(ShopifyErrors.MissingJwtTokenError);

    req = {
      headers: {
        authorization: "What's a bearer token?",
      },
    } as http.IncomingMessage;

    await expect(() => deleteCurrentSession(req, res)).rejects.toBeInstanceOf(ShopifyErrors.MissingJwtTokenError);
  });
});
