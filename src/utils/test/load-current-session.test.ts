import '../../test/test_helper';

import http from 'http';

import jwt from 'jsonwebtoken';
import Cookies from 'cookies';

import {Context} from '../../context';
import * as ShopifyErrors from '../../error';
import {Session} from '../../auth/session';
import {JwtPayload} from '../decode-session-token';
import loadCurrentSession from '../load-current-session';
import {ShopifyOAuth} from '../../auth/oauth/oauth';

jest.mock('cookies');

describe('loadCurrentSession', () => {
  let jwtPayload: JwtPayload;

  beforeEach(() => {
    jwtPayload = {
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
  });

  it('gets the current session from cookies for non-embedded apps', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const cookieId = '1234-this-is-a-cookie-session-id';

    const session = new Session(
      cookieId,
      'test-shop.myshopify.io',
      'state',
      true,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    Cookies.prototype.get.mockImplementation(() => cookieId);

    await expect(loadCurrentSession(req, res)).resolves.toEqual(session);
  });

  it('loads nothing if there is no session for non-embedded apps', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    Cookies.prototype.get.mockImplementation(() => null);

    await expect(loadCurrentSession(req, res)).resolves.toBeUndefined();
  });

  it('gets the current session from JWT token for embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

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
      'test-shop.myshopify.io',
      'state',
      true,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(loadCurrentSession(req, res)).resolves.toEqual(session);
  });

  it('loads nothing if no authorization header is present', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const req = {headers: {}} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    await expect(loadCurrentSession(req, res)).resolves.toBeUndefined();
  });

  it('loads nothing if there is no session for embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, {
      algorithm: 'HS256',
    });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    await expect(loadCurrentSession(req, res)).resolves.toBeUndefined();
  });

  it('fails if authorization header is missing or is not a Bearer token', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const req = {
      headers: {
        authorization: 'Not a Bearer token!',
      },
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    await expect(() => loadCurrentSession(req, res)).rejects.toBeInstanceOf(
      ShopifyErrors.MissingJwtTokenError,
    );
  });

  it('falls back to the cookie session for embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const req = {
      headers: {
        authorization: '',
      },
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const cookieId = '1234-this-is-a-cookie-session-id';

    const session = new Session(
      cookieId,
      'test-shop.myshopify.io',
      'state',
      true,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    Cookies.prototype.get.mockImplementation(() => cookieId);

    await expect(loadCurrentSession(req, res)).resolves.toEqual(session);
  });

  it('loads offline sessions from cookies', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const cookieId = ShopifyOAuth.getOfflineSessionId('test-shop.myshopify.io');

    const session = new Session(
      cookieId,
      'test-shop.myshopify.io',
      'state',
      false,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    Cookies.prototype.get.mockImplementation(() => cookieId);

    await expect(loadCurrentSession(req, res, false)).resolves.toEqual(session);
  });

  it('loads offline sessions from JWT token', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

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
      ShopifyOAuth.getOfflineSessionId('test-shop.myshopify.io'),
      'test-shop.myshopify.io',
      'state',
      false,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(loadCurrentSession(req, res, false)).resolves.toEqual(session);
  });
});
