import {
  setAbstractFetchFunc,
  Headers,
  Request,
  Response,
  Cookies,
} from '../../adapters/abstract-http';
import Shopify from '../../index-node';
import * as mockAdapter from '../../adapters/mock-adapter';
import {Context} from '../../context';
import {Session} from '../../auth/session';
import {JwtPayload} from '../decode-session-token';
import deleteCurrentSession from '../delete-current-session';
import loadCurrentSession from '../load-current-session';
import {ShopifyOAuth} from '../../auth/oauth/oauth';
import {signJWT} from '../setup-jest';

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

    const session = new Session(
      sessionId,
      'test-shop.myshopify.io',
      'state',
      true,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(deleteCurrentSession(req)).resolves.toBe(true);
    await expect(loadCurrentSession(req)).resolves.toBe(undefined);
  });

  it('finds and deletes the current session when using JWT', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = await signJWT(jwtPayload);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any as Request;

    const session = new Session(
      `test-shop.myshopify.io_${jwtPayload.sub}`,
      'test-shop.myshopify.io',
      'state',
      true,
    );
    await expect(
      Context.SESSION_STORAGE.storeSession(session),
    ).resolves.toEqual(true);

    await expect(deleteCurrentSession(req)).resolves.toBe(true);
    await expect(loadCurrentSession(req)).resolves.toBe(undefined);
  });

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

  it('throws an error when no cookie is found', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const req = {} as Request;

    await expect(() => deleteCurrentSession(req)).rejects.toBeInstanceOf(
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

    await expect(() => deleteCurrentSession(req)).rejects.toBeInstanceOf(
      Shopify.Errors.MissingJwtTokenError,
    );
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
