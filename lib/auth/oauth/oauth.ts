import {v4 as uuidv4} from 'uuid';

import ProcessedQuery from '../../utils/processed-query';
import {ConfigInterface} from '../../base-types';
import * as ShopifyErrors from '../../error';
import {createValidateHmac} from '../../utils/hmac-validator';
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
  AdapterHeaders,
  Cookies,
  NormalizedResponse,
} from '../../../runtime/http';
import {logger} from '../../logger';

import {
  SESSION_COOKIE_NAME,
  STATE_COOKIE_NAME,
  BeginParams,
  CallbackParams,
  AuthQuery,
  AccessTokenResponse,
  OnlineAccessResponse,
  OnlineAccessInfo,
  CallbackResponse,
} from './types';
import {nonce} from './nonce';
import {safeCompare} from './safe-compare';

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

    const log = logger(config);
    log.info('Beginning OAuth', {shop, isOnline, callbackPath});

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
      path: callbackPath,
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

    const redirectUrl = `https://${cleanShop}/admin/oauth/authorize${processedQuery.stringify()}`;
    const response: NormalizedResponse = {
      statusCode: 302,
      statusText: 'Found',
      headers: {
        ...cookies.response.headers!,
        Location: redirectUrl,
      },
    };

    log.debug(`OAuth startedm redirecting to ${redirectUrl}`, {shop, isOnline});

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
    const shop = query.get('shop')!;

    const log = logger(config);
    log.info('Completing OAuth', {shop, isOnline});

    const cookies = new Cookies(request, {} as NormalizedResponse, {
      keys: [config.apiSecretKey],
      secure: true,
    });

    const stateFromCookie = await cookies.getAndVerify(STATE_COOKIE_NAME);
    cookies.deleteCookie(STATE_COOKIE_NAME);
    if (!stateFromCookie) {
      log.error('Could not find OAuth cookie', {shop, isOnline});

      throw new ShopifyErrors.CookieNotFound(
        `Cannot complete OAuth process. Could not find an OAuth cookie for shop url: ${shop}`,
      );
    }

    const authQuery: AuthQuery = Object.fromEntries(query.entries());
    if (!(await validQuery({config, query: authQuery, stateFromCookie}))) {
      log.error('Invalid OAuth callback', {
        shop,
        isOnline,
        stateFromCookie,
      });

      throw new ShopifyErrors.InvalidOAuthError('Invalid OAuth callback.');
    }

    log.debug('OAuth request is valid, requesting access token', {
      shop,
      isOnline,
    });

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

    log.debug('Received access token, creating session', {shop, isOnline});

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
  if (
    !isOnline &&
    (postResponse.body as OnlineAccessResponse).associated_user
  ) {
    throw new ShopifyErrors.InvalidOAuthError(
      'Attempted to complete offline OAuth flow, but received an online token response. This is likely because ' +
        "you're not setting the isOnline parameter consistently between begin() and callback()",
    );
  }

  if (
    isOnline &&
    !(postResponse.body as OnlineAccessResponse).associated_user
  ) {
    throw new ShopifyErrors.InvalidOAuthError(
      'Attempted to complete online OAuth flow, but received an offline token response. This is likely because ' +
        "you're not setting the isOnline parameter consistently between begin() and callback()",
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

    return new Session({
      id: sessionId,
      shop,
      state: stateFromCookie,
      isOnline,
      accessToken: access_token,
      scope,
      expires: sessionExpiration,
      onlineAccessInfo: rest,
    });
  } else {
    const responseBody = postResponse.body as AccessTokenResponse;
    return new Session({
      id: createGetOfflineId(config)(shop),
      shop,
      state: stateFromCookie,
      isOnline,
      accessToken: responseBody.access_token,
      scope: responseBody.scope,
    });
  }
}

function throwIfPrivateApp(isPrivateApp: boolean, message: string): void {
  if (isPrivateApp) {
    throw new ShopifyErrors.PrivateAppError(message);
  }
}
