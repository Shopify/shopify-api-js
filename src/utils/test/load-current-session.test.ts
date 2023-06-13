<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
import http from 'http';

import jwt from 'jsonwebtoken';
import Cookies from 'cookies';

=======
import {
  setAbstractFetchFunc,
  Headers,
  Request,
  Response,
  Cookies,
} from '../../runtime/http';
import Shopify from '../../adapters/node';
import * as mockAdapter from '../../adapters/mock';
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts
import {Context} from '../../context';
import * as ShopifyErrors from '../../error';
import {Session} from '../../auth/session';
import {JwtPayload} from '../decode-session-token';
import loadCurrentSession from '../load-current-session';
import {ShopifyOAuth} from '../../auth/oauth/oauth';
import {signJWT} from '../setup-jest';

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

<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const cookieId = '1234-this-is-a-cookie-session-id';
=======
    const sessionId = '1234-this-is-a-cookie-session-id';
    const req = {
      headers: await createSessionCookieHeader(
        sessionId,
        Context.API_SECRET_KEY,
      ),
    } as Request;
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts

    const session = new Session(
      cookieId,
      'test-shop.myshopify.io',
      'state',
      true,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
    Cookies.prototype.get.mockImplementation(() => cookieId);

    await expect(loadCurrentSession(req, res)).resolves.toEqual(session);
=======
    await expect(loadCurrentSession(req)).resolves.toEqual(session);
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts
  });

  it('loads nothing if there is no session for non-embedded apps', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    Cookies.prototype.get.mockImplementation(() => null);
=======
    const req = {} as Request;
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts

    await expect(loadCurrentSession(req)).resolves.toBeUndefined();
  });

  it('gets the current session from JWT token for embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = await signJWT(jwtPayload);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;
=======
    } as any as Request;
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts

    const session = new Session(
      `test-shop.myshopify.io_${jwtPayload.sub}`,
      'test-shop.myshopify.io',
      'state',
      true,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(loadCurrentSession(req)).resolves.toEqual(session);
  });

  it('loads nothing if no authorization header is present', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
    const req = {headers: {}} as http.IncomingMessage;
    const res = {} as http.ServerResponse;
=======
    const req = {headers: {}} as Request;
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts

    await expect(loadCurrentSession(req)).resolves.toBeUndefined();
  });

  it('loads nothing if there is no session for embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = await signJWT(jwtPayload);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;
=======
    } as any as Request;
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts

    await expect(loadCurrentSession(req)).resolves.toBeUndefined();
  });

  it('fails if authorization header is missing or is not a Bearer token', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const req = {
      headers: {
        authorization: 'Not a Bearer token!',
      },
<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    await expect(() => loadCurrentSession(req, res)).rejects.toBeInstanceOf(
      ShopifyErrors.MissingJwtTokenError,
=======
    } as any as Request;

    await expect(() => loadCurrentSession(req)).rejects.toBeInstanceOf(
      Shopify.Errors.MissingJwtTokenError,
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts
    );
  });

  it('falls back to the cookie session for embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const req = {
      headers: {
        authorization: '',
<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
      },
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const cookieId = '1234-this-is-a-cookie-session-id';
=======
        ...(await createSessionCookieHeader(sessionId, Context.API_SECRET_KEY)),
      },
    } as any as Request;
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts

    const session = new Session(
      cookieId,
      'test-shop.myshopify.io',
      'state',
      true,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
    Cookies.prototype.get.mockImplementation(() => cookieId);

    await expect(loadCurrentSession(req, res)).resolves.toEqual(session);
=======
    await expect(loadCurrentSession(req)).resolves.toEqual(session);
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts
  });

  it('loads offline sessions from cookies', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const cookieId = ShopifyOAuth.getOfflineSessionId('test-shop.myshopify.io');
=======
    const sessionId = ShopifyOAuth.getOfflineSessionId(
      'test-shop.myshopify.io',
    );
    const req = {
      headers: await createSessionCookieHeader(
        sessionId,
        Context.API_SECRET_KEY,
      ),
    } as Request;
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts

    const session = new Session(
      cookieId,
      'test-shop.myshopify.io',
      'state',
      false,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
    Cookies.prototype.get.mockImplementation(() => cookieId);

    await expect(loadCurrentSession(req, res, false)).resolves.toEqual(session);
=======
    await expect(loadCurrentSession(req, false)).resolves.toEqual(session);
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts
  });

  it('loads offline sessions from JWT token', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = await signJWT(jwtPayload);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;
=======
    } as any as Request;
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts

    const session = new Session(
      ShopifyOAuth.getOfflineSessionId('test-shop.myshopify.io'),
      'test-shop.myshopify.io',
      'state',
      false,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(loadCurrentSession(req, false)).resolves.toEqual(session);
  });
});
<<<<<<< HEAD:src/utils/test/load-current-session.test.ts
=======

async function createSessionCookieHeader(
  sessionId: string,
  key: string,
): Promise<Headers> {
  const req = {} as Request;
  const res = {} as Response;
  const cookies = new Cookies(req, res, {keys: [key]});
  await cookies.setAndSign(Shopify.Auth.SESSION_COOKIE_NAME, sessionId);

  return {
    Cookie: Object.values(cookies.outgoingCookieJar)
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join(','),
  };
}
>>>>>>> origin/isomorphic/main:src/utils/__tests__/load-current-session.test.ts
