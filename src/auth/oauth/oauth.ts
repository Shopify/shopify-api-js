import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import Cookies from 'cookies';
import { Context } from '../../context';
import utils from '../../utils';
import querystring from 'querystring';
import { AuthQuery, AccessTokenResponse, OnlineAccessResponse } from '../types';
import { Session } from '../session';
import { DataType, HttpClient } from '../../clients/http_client';
import ShopifyErrors from '../../error';

const ShopifyOAuth = {
  async beginAuth(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    shop: string,
    redirect: string,
    isOnline = false
  ): Promise<string> {
    Context.throwIfUnitialized();

    const cookies = new Cookies(request, response, {
      keys: [Context.API_SECRET_KEY],
    });

    const state = utils.nonce();

    const session = new Session(isOnline ? uuidv4() : shop + '_offline');
    session.shop = shop;
    session.state = state;
    session.isOnline = isOnline;

    await Context.storeSession(session);

    cookies.set('shopify_app_session', session.id, {
      signed: true,
      expires: new Date(Date.now() + 60000),
    });

    const query = {
      client_id: Context.API_KEY,
      scope: Context.SCOPES,
      redirect_uri: redirect,
      state: state,
      'grant_options[]': isOnline ? 'per_user' : '',
    };

    const queryString = querystring.stringify(query);

    return `https://${shop}/admin/oauth/authorize?${queryString}`;
  },

  async validateAuthCallback(
    request: http.IncomingMessage,
    response: http.ServerResponse,
    query: AuthQuery
  ): Promise<void> {
    Context.throwIfUnitialized();

    const cookies = new Cookies(request, response, {
      keys: [Context.API_SECRET_KEY],
    });

    const sessionCookie: string | undefined = cookies.get(
      'shopify_app_session',
      { signed: true }
    );

    if (!sessionCookie) {
      throw new ShopifyErrors.SessionNotFound(
        `Cannot complete OAuth process. No session cookie found for the specified shop url: ${query.shop}`
      );
    }

    const currentSession = await Context.loadSession(sessionCookie);

    if (!currentSession) {
      throw new ShopifyErrors.SessionNotFound(
        `Cannot complete OAuth process. No session found for the specified shop url: ${query.shop}`
      );
    }

    if (!validQuery(query, currentSession)) {
      throw new ShopifyErrors.InvalidOAuthError('Invalid OAuth callback.');
    }

    const body = {
      client_id: Context.API_KEY,
      client_secret: Context.API_SECRET_KEY,
      code: query.code,
    };

    const postParams = {
      path: '/admin/oauth/access_token',
      type: DataType.JSON,
      data: body,
    };

    const client = new HttpClient(currentSession.shop);
    if (currentSession.isOnline) {
      const response = (await client.post(postParams)) as OnlineAccessResponse;

      const { access_token, scope, ...rest } = response;
      const sessionExpiration = new Date(
        Date.now() + response.expires_in * 1000
      );
      currentSession.accessToken = access_token;
      currentSession.expires = sessionExpiration;
      currentSession.scope = scope;
      currentSession.onlineAccesInfo = rest;

      cookies.set('shopify_app_session', sessionCookie, {
        signed: true,
        domain: Context.HOST_NAME,
        expires: sessionExpiration,
      });
    } else {
      const response = (await client.post(postParams)) as AccessTokenResponse;
      currentSession.accessToken = response.access_token;
      currentSession.scope = response.scope;
    }

    await Context.storeSession(currentSession);
  },
};

function validQuery(query: AuthQuery, session: Session): boolean {
  return (
    utils.validateHmac(query) &&
    utils.validateShop(query.shop) &&
    utils.safeCompare(query.state, session.state as string)
  );
}

export { ShopifyOAuth };
