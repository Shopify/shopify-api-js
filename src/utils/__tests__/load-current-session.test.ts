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
import loadCurrentSession from '../load-current-session';
import {ShopifyOAuth} from '../../auth/oauth/oauth';
import {signJWT} from '../setup-jest';

setAbstractFetchFunc(mockAdapter.abstractFetch);

jest.mock('cookies');

describe('loadCurrentSession', () => {
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

  it('gets the current session from cookies for non-embedded apps', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const sessionId = '1234-this-is-a-cookie-session-id';
    const req = {
      headers: await createSessionCookieHeader(
        sessionId,
        Context.API_SECRET_KEY,
      ),
    } as Request;
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

    await expect(loadCurrentSession(req, res)).resolves.toEqual(session);
  });

  it('loads nothing if there is no session for non-embedded apps', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const req = {} as Request;
    const res = {} as Response;

    await expect(loadCurrentSession(req, res)).resolves.toBeUndefined();
  });

  it('gets the current session from JWT token for embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = await signJWT(jwtPayload);
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

    await expect(loadCurrentSession(req, res)).resolves.toEqual(session);
  });

  it('loads nothing if no authorization header is present', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const req = {headers: {}} as Request;
    const res = {} as Response;

    await expect(loadCurrentSession(req, res)).resolves.toBeUndefined();
  });

  it('loads nothing if there is no session for embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = await signJWT(jwtPayload);
    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any as Request;
    const res = {} as Response;

    await expect(loadCurrentSession(req, res)).resolves.toBeUndefined();
  });

  it('fails if authorization header is missing or is not a Bearer token', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const req = {
      headers: {
        authorization: 'Not a Bearer token!',
      },
    } as any as Request;
    const res = {} as Response;

    await expect(() => loadCurrentSession(req, res)).rejects.toBeInstanceOf(
      Shopify.Errors.MissingJwtTokenError,
    );
  });

  it('falls back to the cookie session for embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const sessionId = '1234-this-is-a-cookie-session-id';
    const req = {
      headers: {
        authorization: '',
        ...(await createSessionCookieHeader(sessionId, Context.API_SECRET_KEY)),
      },
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

    await expect(loadCurrentSession(req, res)).resolves.toEqual(session);
  });

  it('loads offline sessions from cookies', async () => {
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
    } as Request;
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

    await expect(loadCurrentSession(req, res, false)).resolves.toEqual(session);
  });

  it('loads offline sessions from JWT token', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = await signJWT(jwtPayload);
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

    await expect(loadCurrentSession(req, res, false)).resolves.toEqual(session);
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
