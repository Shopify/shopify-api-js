import '../../test/test_helper';

import http from 'http';
import jwt from 'jsonwebtoken';

import { Context } from '../../context';
import { Session } from '../../auth/session';
import ShopifyErrors from '../../error';
import { JwtPayload } from '../decode-session-token';
import loadCurrentSession from '../load-current-session';

jest.mock('cookies');
import Cookies from 'cookies';

describe("loadCurrentSession", () => {
  let jwtPayload: JwtPayload;

  beforeEach(() => {
    jwtPayload = {
      iss: "test-shop.myshopify.io/admin",
      dest: "test-shop.myshopify.io",
      aud: Context.API_KEY,
      sub: "1",
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: "4321",
      sid: "abc123",
    };
  });

  it("gets the current session from cookies for non-embedded apps", async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const cookieId = '1234-this-is-a-cookie-session-id';

    const session = new Session(cookieId);
    await expect(Context.storeSession(session)).resolves.toEqual(true);

    Cookies.prototype.get.mockImplementation(() => cookieId);

    await expect(loadCurrentSession(req, res)).resolves.toEqual(session);
  });

  it("loads nothing if there is no session for non-embedded apps", async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    Cookies.prototype.get.mockImplementation(() => null);

    await expect(loadCurrentSession(req, res)).resolves.toBeNull();
  });

  it("gets the current session from JWT token for embedded apps", async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, { algorithm: 'HS256' });
    const req = {
      headers: {
        "authorization": `Bearer ${token}`,
      }
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const session = new Session(jwtPayload.sid);
    await expect(Context.storeSession(session)).resolves.toEqual(true);

    await expect(loadCurrentSession(req, res)).resolves.toEqual(session);
  });

  it("converts an OAuth session into a JWT one", async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, { algorithm: 'HS256' });
    const req = {
      headers: {
        "authorization": `Bearer ${token}`,
      }
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const cookieId = '1234-this-is-a-cookie-session-id';

    // We expect to find the OAuth cookie session, which will be deleted after we migrate it over to a JWT one
    const session = new Session(cookieId);
    await expect(Context.storeSession(session)).resolves.toEqual(true);
    Cookies.prototype.get.mockImplementation(() => cookieId);

    const jwtSession = new Session(jwtPayload.sid);
    jwtSession.expires = new Date(jwtPayload.exp * 1000);
    await expect(loadCurrentSession(req, res)).resolves.toEqual(jwtSession);
    await expect(Context.loadSession(cookieId)).resolves.toBeNull();
  });

  it("loads nothing if no authorization header is present", async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const req = { headers: {} } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    await expect(loadCurrentSession(req, res)).resolves.toBeNull();
  });

  it("loads nothing if there is no session for embedded apps", async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const token = jwt.sign(jwtPayload, Context.API_SECRET_KEY, { algorithm: 'HS256' });
    const req = {
      headers: {
        "authorization": `Bearer ${token}`,
      }
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    await expect(loadCurrentSession(req, res)).resolves.toBeNull();
  });

  it("fails if authorization header is not a Bearer token", async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const req = {
      headers: {
        'authorization': 'Not a Bearer token!',
      }
    } as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    await expect(loadCurrentSession(req, res)).rejects.toThrow(ShopifyErrors.MissingJwtTokenError);
  });
});
