import jwt from 'jsonwebtoken';

import {
  setAbstractFetchFunc,
  Headers,
  Request,
  Response,
} from '../../adapters/abstract-http';
import Shopify from '../../index-node';
import * as mockAdapter from '../../adapters/mock-adapter';
import {Context} from '../../context';
import {Session} from '../../auth/session';
import {JwtPayload} from '../decode-session-token';
import deleteCurrentSession from '../delete-current-session';
import loadCurrentSession from '../load-current-session';
import {ShopifyOAuth} from '../../auth/oauth/oauth';

setAbstractFetchFunc(mockAdapter.abstractFetch);

jest.mock('cookies');

describe('deleteCurrenSession', () => {
  let jwtPayload: JwtPayload;
  beforeEach(() => {
    mockAdapter.reset();
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

  it('finds and deletes the current session when using cookies', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const sessionId = '1234-this-is-a-cookie-session-id';
    const req = {
      headers: createSessionCookieHeader(sessionId),
    } as any as Request;
    const res = {} as Response;

    const session = new Session(
      sessionId,
      'test-shop.myshopify.io',
      'state',
      true,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(deleteCurrentSession(req, res)).resolves.toBe(true);
    await expect(loadCurrentSession(req, res)).resolves.toBe(undefined);
  });

  it('finds and deletes the current session when using JWT', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, {
      algorithm: 'HS256',
    });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any as Request;
    const res = {} as Response;

    const session = new Session(
      `test-shop.myshopify.io_${jwtPayload.sub}`,
      'test-shop.myshopify.io',
      'state',
      true,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(deleteCurrentSession(req, res)).resolves.toBe(true);
    await expect(loadCurrentSession(req, res)).resolves.toBe(undefined);
  });

  it('finds and deletes the current offline session when using cookies', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const sessionId = ShopifyOAuth.getOfflineSessionId(
      'test-shop.myshopify.io',
    );
    const req = {
      headers: createSessionCookieHeader(sessionId),
    } as any as Request;
    const res = {} as Response;

    const session = new Session(
      sessionId,
      'test-shop.myshopify.io',
      'state',
      false,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(deleteCurrentSession(req, res, false)).resolves.toBe(true);
    await expect(loadCurrentSession(req, res, false)).resolves.toBe(undefined);
  });

  it('finds and deletes the current offline session when using JWT', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, {
      algorithm: 'HS256',
    });
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any as Request;
    const res = {} as Response;

    const session = new Session(
      ShopifyOAuth.getOfflineSessionId('test-shop.myshopify.io'),
      'test-shop.myshopify.io',
      'state',
      false,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(deleteCurrentSession(req, res, false)).resolves.toBe(true);
    await expect(loadCurrentSession(req, res, false)).resolves.toBe(undefined);
  });

  it('throws an error when no cookie is found', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const req = {} as Request;
    const res = {} as Response;

    await expect(() => deleteCurrentSession(req, res)).rejects.toBeInstanceOf(
      Shopify.Errors.SessionNotFound,
    );
  });

  it('throws an error when authorization header is not a bearer token', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const req = {
      headers: {
        authorization: "What's a bearer token?",
      },
    } as any as Request;
    const res = {} as Response;

    await expect(() => deleteCurrentSession(req, res)).rejects.toBeInstanceOf(
      Shopify.Errors.MissingJwtTokenError,
    );
  });
});

function createSessionCookieHeader(sessionId: string): Headers {
  return {
    Cookie: `${Shopify.Auth.SESSION_COOKIE_NAME}=${sessionId}`,
  };
}
