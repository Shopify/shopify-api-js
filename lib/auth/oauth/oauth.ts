import {v4 as uuidv4} from 'uuid';

import ProcessedQuery from '../../utils/processed-query';
import {ConfigInterface} from '../../base-types';
import * as ShopifyErrors from '../../error';
import {validateHmac} from '../../utils/hmac-validator';
import {sanitizeShop} from '../../utils/shop-validator';
import {Session} from '../../session/session';
import {getJwtSessionId, getOfflineId} from '../../session/session-utils';
import {httpClientClass} from '../../clients/http_client/http_client';
import {DataType, RequestReturn} from '../../clients/http_client/types';
import {
  abstractConvertRequest,
  abstractConvertIncomingResponse,
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
} from './types';
import {nonce} from './nonce';
import {safeCompare} from './safe-compare';

export interface CallbackResponse<T = AdapterHeaders> {
  headers: T;
  session: Session;
}

export function begin(config: ConfigInterface) {
  return async ({
    shop,
    callbackPath,
    isOnline,
    ...adapterArgs
  }: BeginParams): Promise<AdapterResponse> => {
    throwIfCustomStoreApp(
      config.isCustomStoreApp,
      'Cannot perform OAuth for private apps',
    );

    const log = logger(config);
    log.info('Beginning OAuth', {shop, isOnline, callbackPath});

    const request = await abstractConvertRequest(adapterArgs);
    if (request.headers['User-Agent']?.includes('GoogleOther') || !shop) {
      log.debug('Possible bot request to auth: ', {
        userAgent: request.headers['User-Agent'],
        shop,
      });
      throw new ShopifyErrors.HttpRequestError(
        'Possible Bot request or missing shop params',
      );
    }

    const response = await abstractConvertIncomingResponse(adapterArgs);

    const cookies = new Cookies(request, response, {
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

    const cleanShop = sanitizeShop(config)(shop, true)!;
    const redirectUrl = `https://${cleanShop}/admin/oauth/authorize${processedQuery.stringify()}`;
    response.statusCode = 302;
    response.statusText = 'Found';
    response.headers = {
      ...response.headers,
      ...cookies.response.headers!,
      Location: redirectUrl,
    };

    log.debug(`OAuth started, redirecting to ${redirectUrl}`, {shop, isOnline});

    return abstractConvertResponse(response, adapterArgs);
  };
}

export function callback(config: ConfigInterface) {
  return async function callback<T = AdapterHeaders>({
    ...adapterArgs
  }: CallbackParams): Promise<CallbackResponse<T>> {
    throwIfCustomStoreApp(
      config.isCustomStoreApp,
      'Cannot perform OAuth for private apps',
    );

    const log = logger(config);

    const request = await abstractConvertRequest(adapterArgs);

    const query = new URL(
      request.url,
      `${config.hostScheme}://${config.hostName}`,
    ).searchParams;
    const shop = query.get('shop')!;

    if (request.headers['User-Agent']?.includes('GoogleOther') || !shop) {
      log.debug('Possible bot request to auth callback: ', {
        userAgent: request.headers['User-Agent'],
        shop,
      });
      throw new ShopifyErrors.HttpRequestError(
        'Possible Bot request or missing required params',
      );
    }

    log.info('Completing OAuth', {shop});

    const cookies = new Cookies(request, {} as NormalizedResponse, {
      keys: [config.apiSecretKey],
      secure: true,
    });

    const stateFromCookie = await cookies.getAndVerify(STATE_COOKIE_NAME);
    cookies.deleteCookie(STATE_COOKIE_NAME);
    if (!stateFromCookie) {
      log.error('Could not find OAuth cookie', {shop});

      throw new ShopifyErrors.CookieNotFound(
        `Cannot complete OAuth process. Could not find an OAuth cookie for shop url: ${shop}`,
      );
    }

    const authQuery: AuthQuery = Object.fromEntries(query.entries());
    if (!(await validQuery({config, query: authQuery, stateFromCookie}))) {
      log.error('Invalid OAuth callback', {shop, stateFromCookie});

      throw new ShopifyErrors.InvalidOAuthError('Invalid OAuth callback.');
    }

    log.debug('OAuth request is valid, requesting access token', {shop});

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
    const cleanShop = sanitizeShop(config)(query.get('shop')!, true)!;

    const HttpClient = httpClientClass(config);
    const client = new HttpClient({domain: cleanShop});
    const postResponse = await client.post(postParams);

    const session: Session = createSession({
      postResponse,
      shop: cleanShop,
      stateFromCookie,
      config,
    });

    if (!config.isEmbeddedApp) {
      await cookies.setAndSign(SESSION_COOKIE_NAME, session.id, {
        expires: session.expires,
        sameSite: 'lax',
        secure: true,
        path: '/',
      });
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
    (await validateHmac(config)(query)) &&
    safeCompare(query.state!, stateFromCookie)
  );
}

function createSession({
  config,
  postResponse,
  shop,
  stateFromCookie,
}: {
  config: ConfigInterface;
  postResponse: RequestReturn;
  shop: string;
  stateFromCookie: string;
}): Session {
  const associatedUser = (postResponse.body as OnlineAccessResponse)
    .associated_user;
  const isOnline = Boolean(associatedUser);

  logger(config).info('Creating new session', {shop, isOnline});

  if (isOnline) {
    let sessionId: string;
    const responseBody = postResponse.body as OnlineAccessResponse;
    const {access_token, scope, ...rest} = responseBody;
    const sessionExpiration = new Date(
      Date.now() + responseBody.expires_in * 1000,
    );

    if (config.isEmbeddedApp) {
      sessionId = getJwtSessionId(config)(
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
      id: getOfflineId(config)(shop),
      shop,
      state: stateFromCookie,
      isOnline,
      accessToken: responseBody.access_token,
      scope: responseBody.scope,
    });
  }
}

function throwIfCustomStoreApp(
  isCustomStoreApp: boolean,
  message: string,
): void {
  if (isCustomStoreApp) {
    throw new ShopifyErrors.PrivateAppError(message);
  }
}
