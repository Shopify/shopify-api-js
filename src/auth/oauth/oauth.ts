import {v4 as uuidv4} from 'uuid';

import ProcessedQuery from '../../utils/processed-query';
import {ConfigInterface} from '../../base-types';
import * as ShopifyErrors from '../../error';
import {nonce} from '../../utils/nonce';
import {createValidateHmac} from '../../utils/hmac-validator';
import {safeCompare} from '../../utils/safe-compare';
import {createSanitizeShop} from '../../utils/shop-validator';
import {Session} from '../../session/session';
import {SessionInterface} from '../../session/types';
import {
  createGetJwtSessionId,
  createGetOfflineId,
} from '../../session/session-utils';
import {createHttpClientClass} from '../../clients/http_client/http_client';
import {DataType, RequestReturn} from '../../clients/http_client/types';
import {
  abstractConvertRequest,
  abstractConvertResponse,
  abstractConvertHeaders,
  AdapterResponse,
  Cookies,
  NormalizedResponse,
  AdapterHeaders,
} from '../../runtime/http';

import {
  BeginParams,
  CallbackParams,
  AuthQuery,
  AccessTokenResponse,
  OnlineAccessResponse,
  OnlineAccessInfo,
  CallbackResponse,
} from './types';

export const SESSION_COOKIE_NAME = 'shopify_app_session';
export const STATE_COOKIE_NAME = 'shopify_app_state';

export function createBegin(config: ConfigInterface) {
  return async ({
    shop,
    callbackPath,
    isOnline,
    ...adapterArgs
  }: BeginParams): Promise<AdapterResponse> => {
    throwIfPrivateApp(
      config.isPrivateApp,
      'Cannot perform OAuth for private apps',
    );

    const cleanShop = createSanitizeShop(config)(shop, true)!;
    const request = await abstractConvertRequest(adapterArgs);

    const cookies = new Cookies(request, {} as NormalizedResponse, {
      keys: [config.apiSecretKey],
      secure: true,
    });

    const state = nonce();

    await cookies.setAndSign(STATE_COOKIE_NAME, state, {
      expires: new Date(Date.now() + 60000),
      sameSite: 'lax',
      secure: true,
    });

    const query = {
      client_id: config.apiKey,
      scope: config.scopes.toString(),
      redirect_uri: `${config.hostScheme}://${config.hostName}${callbackPath}`,
      state,
      'grant_options[]': isOnline ? 'per-user' : '',
    };
    const processedQuery = new ProcessedQuery();
    processedQuery.putAll(query);

    const response: NormalizedResponse = {
      statusCode: 302,
      statusText: 'Found',
      headers: {
        ...cookies.response.headers!,
        Location: `${
          config.hostScheme
        }://${cleanShop}/admin/oauth/authorize${processedQuery.stringify()}`,
      },
    };

    return abstractConvertResponse(response, adapterArgs);
  };
}

export function createCallback(config: ConfigInterface) {
  return async function callback<T = AdapterHeaders>({
    isOnline,
    ...adapterArgs
  }: CallbackParams): Promise<CallbackResponse<T>> {
    throwIfPrivateApp(
      config.isPrivateApp,
      'Cannot perform OAuth for private apps',
    );

    const request = await abstractConvertRequest(adapterArgs);

    const query = new URL(
      request.url,
      `${config.hostScheme}://${config.hostName}`,
    ).searchParams;

    const cookies = new Cookies(request, {} as NormalizedResponse, {
      keys: [config.apiSecretKey],
      secure: true,
    });

    const stateFromCookie = await cookies.getAndVerify(STATE_COOKIE_NAME);
    cookies.deleteCookie(STATE_COOKIE_NAME);
    if (!stateFromCookie) {
      throw new ShopifyErrors.CookieNotFound(
        `Cannot complete OAuth process. Could not find an OAuth cookie for shop url: ${query.get(
          'shop',
        )!}`,
      );
    }

    const authQuery: AuthQuery = Object.fromEntries(query.entries());
    if (!(await validQuery({config, query: authQuery, stateFromCookie}))) {
      throw new ShopifyErrors.InvalidOAuthError('Invalid OAuth callback.');
    }

    const body = {
      client_id: config.apiKey,
      client_secret: config.apiSecretKey,
      code: query.get('code'),
    };

    const postParams = {
      path: '/admin/oauth/access_token',
      type: DataType.JSON,
      data: body,
    };
    const cleanShop = createSanitizeShop(config)(query.get('shop')!, true)!;

    const HttpClient = createHttpClientClass(config);
    const client = new HttpClient({domain: cleanShop});
    const postResponse = await client.post(postParams);

    const session: Session = createSession({
      postResponse,
      shop: cleanShop,
      stateFromCookie,
      isOnline,
      config,
    });

    if (!config.isEmbeddedApp) {
      await cookies.setAndSign(SESSION_COOKIE_NAME, session.id, {
        expires: session.expires,
        sameSite: 'lax',
        secure: true,
      });
    }

    const sessionStored = await config.sessionStorage.storeSession(session);
    if (!sessionStored) {
      throw new ShopifyErrors.SessionStorageError(
        'Session could not be saved. Please check your session storage functionality.',
      );
    }

    return {
      headers: (await abstractConvertHeaders(
        cookies.response.headers!,
        adapterArgs,
      )) as T,
      session,
    };
  };
}

async function validQuery({
  config,
  query,
  stateFromCookie,
}: {
  config: ConfigInterface;
  query: AuthQuery;
  stateFromCookie: string;
}): Promise<boolean> {
  return (
    (await createValidateHmac(config)(query)) &&
    safeCompare(query.state!, stateFromCookie)
  );
}

function createSession({
  config,
  postResponse,
  shop,
  stateFromCookie,
  isOnline,
}: {
  config: ConfigInterface;
  postResponse: RequestReturn;
  shop: string;
  stateFromCookie: string;
  isOnline: boolean;
}): SessionInterface {
  let session: Session;

  if (
    !isOnline &&
    (postResponse.body as OnlineAccessResponse).associated_user
  ) {
    throw new ShopifyErrors.InvalidOAuthError(
      "Attempted to complete offline OAuth flow, but received an online token response. This is likely because you're not setting the isOnline parameter consistently between begin() and callback()",
    );
  }

  if (
    isOnline &&
    !(postResponse.body as OnlineAccessResponse).associated_user
  ) {
    throw new ShopifyErrors.InvalidOAuthError(
      "Attempted to complete online OAuth flow, but received an offline token response. This is likely because you're not setting the isOnline parameter consistently between begin() and callback()",
    );
  }

  if (isOnline) {
    let sessionId: string;
    const responseBody = postResponse.body as OnlineAccessResponse;
    const {access_token, scope, ...rest} = responseBody;
    const sessionExpiration = new Date(
      Date.now() + responseBody.expires_in * 1000,
    );

    if (config.isEmbeddedApp) {
      sessionId = createGetJwtSessionId(config)(
        shop,
        `${(rest as OnlineAccessInfo).associated_user.id}`,
      );
    } else {
      sessionId = uuidv4();
    }

    session = new Session(sessionId, shop, stateFromCookie, isOnline);
    session.accessToken = access_token;
    session.scope = scope;
    session.expires = sessionExpiration;
    session.onlineAccessInfo = rest;
  } else {
    const responseBody = postResponse.body as AccessTokenResponse;
    session = new Session(
      createGetOfflineId(config)(shop),
      shop,
      stateFromCookie,
      isOnline,
    );
    session.accessToken = responseBody.access_token;
    session.scope = responseBody.scope;
  }

  return session;
}

function throwIfPrivateApp(isPrivateApp: boolean, message: string): void {
  if (isPrivateApp) {
    throw new ShopifyErrors.PrivateAppError(message);
  }
}
