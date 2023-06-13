<<<<<<< HEAD:src/utils/test/delete-current-session.test.ts
<<<<<<< HEAD:src/utils/test/delete-current-session.test.ts
import '../../test/test_helper';

import http from 'http';

=======
>>>>>>> origin/isomorphic/crypto:src/utils/__tests__/delete-current-session.test.ts
import jwt from 'jsonwebtoken';

=======
>>>>>>> origin/isomorphic/main:src/utils/__tests__/delete-current-session.test.ts
import {
  setAbstractFetchFunc,
  Headers,
  Request,
  Response,
  Cookies,
} from '../../runtime/http';
import Shopify from '../../adapters/node';
import * as mockAdapter from '../../adapters/mock';
import {Context} from '../../context';
import {Session} from '../../auth/session';
import {JwtPayload} from '../decode-session-token';
import deleteCurrentSession from '../delete-current-session';
import loadCurrentSession from '../load-current-session';
<<<<<<< HEAD:src/utils/test/delete-current-session.test.ts
=======
import {ShopifyOAuth} from '../../auth/oauth/oauth';
import {signJWT} from '../setup-jest';
>>>>>>> origin/isomorphic/main:src/utils/__tests__/delete-current-session.test.ts

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
      headers: await createSessionCookieHeader(
        sessionId,
        Context.API_SECRET_KEY,
      ),
    } as any as Request;

<<<<<<< HEAD:src/utils/test/delete-current-session.test.ts
    const session = new Session(cookieId);
    await expect(Context.storeSession(session)).resolves.toEqual(true);
=======
    const session = new Session(
      sessionId,
      'test-shop.myshopify.io',
      'state',
      true,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);
>>>>>>> origin/isomorphic/crypto:src/utils/__tests__/delete-current-session.test.ts

    await expect(deleteCurrentSession(req)).resolves.toBe(true);
    await expect(loadCurrentSession(req)).resolves.toBe(undefined);
  });

  it('finds and deletes the current session when using JWT', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

<<<<<<< HEAD:src/utils/test/delete-current-session.test.ts
    const token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, {algorithm: 'HS256'});
=======
    const token = await signJWT(jwtPayload);
>>>>>>> origin/isomorphic/main:src/utils/__tests__/delete-current-session.test.ts
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any as Request;

    const session = new Session(`test-shop.myshopify.io_${jwtPayload.sub}`);
    await expect(Context.storeSession(session)).resolves.toEqual(true);

    await expect(deleteCurrentSession(req)).resolves.toBe(true);
    await expect(loadCurrentSession(req)).resolves.toBe(undefined);
  });

<<<<<<< HEAD:src/utils/test/delete-current-session.test.ts
=======
  it('finds and deletes the current offline session when using cookies', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const sessionId = ShopifyOAuth.getOfflineSessionId(
      'test-shop.myshopify.io',
    );
    const req = {
      headers: await createSessionCookieHeader(
        sessionId,
        Context.API_SECRET_KEY,
      ),
    } as any as Request;

    const session = new Session(
      sessionId,
      'test-shop.myshopify.io',
      'state',
      false,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(deleteCurrentSession(req, false)).resolves.toBe(true);
    await expect(loadCurrentSession(req, false)).resolves.toBe(undefined);
  });

  it('finds and deletes the current offline session when using JWT', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = await signJWT(jwtPayload);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any as Request;

    const session = new Session(
      ShopifyOAuth.getOfflineSessionId('test-shop.myshopify.io'),
      'test-shop.myshopify.io',
      'state',
      false,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(deleteCurrentSession(req, false)).resolves.toBe(true);
    await expect(loadCurrentSession(req, false)).resolves.toBe(undefined);
  });

>>>>>>> origin/isomorphic/crypto:src/utils/__tests__/delete-current-session.test.ts
  it('throws an error when no cookie is found', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const req = {} as Request;

<<<<<<< HEAD:src/utils/test/delete-current-session.test.ts
<<<<<<< HEAD:src/utils/test/delete-current-session.test.ts
    await expect(() => deleteCurrentSession(req, res)).rejects.toBeInstanceOf(ShopifyErrors.SessionNotFound);
=======
    await expect(() => deleteCurrentSession(req, res)).rejects.toBeInstanceOf(
=======
    await expect(() => deleteCurrentSession(req)).rejects.toBeInstanceOf(
>>>>>>> origin/isomorphic/main:src/utils/__tests__/delete-current-session.test.ts
      Shopify.Errors.SessionNotFound,
    );
>>>>>>> origin/isomorphic/crypto:src/utils/__tests__/delete-current-session.test.ts
  });

  it('throws an error when authorization header is missing or not a bearer token', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    let req = {
      headers: {},
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    await expect(() => deleteCurrentSession(req, res)).rejects.toBeInstanceOf(ShopifyErrors.MissingJwtTokenError);

    req = {
      headers: {
        authorization: "What's a bearer token?",
      },
<<<<<<< HEAD:src/utils/test/delete-current-session.test.ts
    } as http.IncomingMessage;

    await expect(() => deleteCurrentSession(req, res)).rejects.toBeInstanceOf(ShopifyErrors.MissingJwtTokenError);
=======
    } as any as Request;

    await expect(() => deleteCurrentSession(req)).rejects.toBeInstanceOf(
      Shopify.Errors.MissingJwtTokenError,
    );
>>>>>>> origin/isomorphic/crypto:src/utils/__tests__/delete-current-session.test.ts
  });
});

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
