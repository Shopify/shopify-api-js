import '../../test/test_helper';

import http from 'http';

import jwt from 'jsonwebtoken';
import Cookies from 'cookies';

import {Session} from '../../auth/session';
import OAuth, {ShopifyOAuth} from '../../auth/oauth';
import withSession from '../with-session';
import {Context} from '../../context';
import {RestWithSession, GraphqlWithSession} from '../types';
import {RestClient} from '../../clients/rest';
import {GraphqlClient} from '../../clients/graphql';
import * as ShopifyErrors from '../../error';

jest.mock('cookies');

describe('withSession', () => {
  const shop = 'fake-shop.myshopify.io';

  it('throws an error for missing shop when !isOnline', async () => {
    await expect(
      withSession({clientType: 'rest', isOnline: false}),
    ).rejects.toThrow(ShopifyErrors.MissingRequiredArgument);
  });

  it('throws an error for missing request and response objects when isOnline', async () => {
    await expect(
      withSession({clientType: 'graphql', isOnline: true}),
    ).rejects.toThrow(ShopifyErrors.MissingRequiredArgument);
  });

  it('throws an error for unsupported clientTypes', async () => {

    /* we need to set up a session for this test, because errors will be thrown for a missing session before
    hitting the clientType error */
    const offlineId = OAuth.getOfflineSessionId(shop);
    const session = new Session(offlineId, shop, 'state', false);
    session.accessToken = 'gimme-access';
    await Context.SESSION_STORAGE.storeSession(session);

    await expect(
      withSession({clientType: 'blah' as any, isOnline: false, shop}),
    ).rejects.toThrow(ShopifyErrors.UnsupportedClientType);
  });

  it('throws an error when there is no session matching the params requested', async () => {
    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    await expect(
      withSession({clientType: 'rest', isOnline: false, shop}),
    ).rejects.toThrow(ShopifyErrors.SessionNotFound);
    await expect(
      withSession({clientType: 'graphql', isOnline: true, req, res}),
    ).rejects.toThrowError(ShopifyErrors.SessionNotFound);
  });

  it('throws an error when the session is not yet authenticated', async () => {
    const offlineId = OAuth.getOfflineSessionId(shop);
    const session = new Session(offlineId, shop, 'state', false);
    await Context.SESSION_STORAGE.storeSession(session);

    await expect(
      withSession({clientType: 'rest', isOnline: false, shop}),
    ).rejects.toThrow(ShopifyErrors.InvalidSession);
  });

  it('returns an object containing the appropriate client and session for offline sessions', async () => {
    const offlineId = OAuth.getOfflineSessionId(shop);
    const session = new Session(offlineId, shop, 'state', false);
    session.accessToken = 'gimme-access';
    await Context.SESSION_STORAGE.storeSession(session);

    const restRequestCtx = (await withSession({
      clientType: 'rest',
      isOnline: false,
      shop,
    })) as RestWithSession;

    const gqlRequestCtx = (await withSession({
      clientType: 'graphql',
      isOnline: false,
      shop,
    })) as GraphqlWithSession;

    expect(restRequestCtx).toBeDefined();
    expect(restRequestCtx.session.shop).toBe(shop);
    expect(restRequestCtx.client).toBeInstanceOf(RestClient);

    expect(gqlRequestCtx).toBeDefined();
    expect(gqlRequestCtx.session.shop).toBe(shop);
    expect(gqlRequestCtx.client).toBeInstanceOf(GraphqlClient);
  });

  it('returns an object containing the appropriate client and session for online && non-embedded apps', async () => {
    Context.IS_EMBEDDED_APP = false;
    Context.initialize(Context);

    const session = new Session(`12345`, shop, 'state', true);
    session.accessToken = 'gimme-access';
    await Context.SESSION_STORAGE.storeSession(session);

    const req = {} as http.IncomingMessage;
    const res = {} as http.ServerResponse;

    const cookieId = '12345';

    Cookies.prototype.get.mockImplementation(() => cookieId);

    const restRequestCtx = (await withSession({
      clientType: 'rest',
      isOnline: true,
      req,
      res,
    })) as RestWithSession;

    expect(restRequestCtx).toBeDefined();
    expect(restRequestCtx.session.shop).toBe(shop);
    expect(restRequestCtx.client).toBeInstanceOf(RestClient);

    const gqlRequestCtx = (await withSession({
      clientType: 'graphql',
      isOnline: true,
      req,
      res,
    })) as GraphqlWithSession;

    expect(gqlRequestCtx).toBeDefined();
    expect(gqlRequestCtx.session.shop).toBe(shop);
    expect(gqlRequestCtx.client).toBeInstanceOf(GraphqlClient);
  });

  it('returns an object with the appropriate client and session for online && embedded apps', async () => {
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);

    const sub = '1';
    const sessionId = ShopifyOAuth.getJwtSessionId(shop, sub);
    const session = new Session(sessionId, shop, 'state', true);
    session.accessToken = 'gimme-access';
    await Context.SESSION_STORAGE.storeSession(session);

    const jwtPayload = {
      iss: `https://${shop}`,
      dest: `https://${shop}`,
      aud: Context.API_KEY,
      sub,
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

    const restRequestCtx = (await withSession({
      clientType: 'rest',
      isOnline: true,
      req,
      res,
    })) as RestWithSession;

    expect(restRequestCtx).toBeDefined();
    expect(restRequestCtx.session.shop).toBe(shop);
    expect(restRequestCtx.client).toBeInstanceOf(RestClient);

    const gqlRequestCtx = (await withSession({
      clientType: 'graphql',
      isOnline: true,
      req,
      res,
    })) as GraphqlWithSession;

    expect(gqlRequestCtx).toBeDefined();
    expect(gqlRequestCtx.session.shop).toBe(shop);
    expect(gqlRequestCtx.client).toBeInstanceOf(GraphqlClient);
  });
});
