import {isbot} from 'isbot';

import {throwFailedRequest} from '../../clients/common';
import ProcessedQuery from '../../utils/processed-query';
import {ConfigInterface} from '../../base-types';
import * as ShopifyErrors from '../../error';
import {validateHmac} from '../../utils/hmac-validator';
import {sanitizeShop} from '../../utils/shop-validator';
import {Session} from '../../session/session';
import {
  abstractConvertRequest,
  abstractConvertIncomingResponse,
  abstractConvertResponse,
  abstractConvertHeaders,
  AdapterResponse,
  AdapterHeaders,
  Cookies,
  NormalizedResponse,
  NormalizedRequest,
} from '../../../runtime/http';
import {logger, ShopifyLogger} from '../../logger';
import {DataType} from '../../clients/types';
import {fetchRequestFactory} from '../../utils/fetch-request';

import {
  SESSION_COOKIE_NAME,
  STATE_COOKIE_NAME,
  BeginParams,
  CallbackParams,
  AuthQuery,
  AccessTokenResponse,
} from './types';
import {nonce} from './nonce';
import {safeCompare} from './safe-compare';
import {createSession} from './create-session';

export type OAuthBegin = (beginParams: BeginParams) => Promise<AdapterResponse>;

export interface CallbackResponse<T = AdapterHeaders> {
  headers: T;
  session: Session;
}

export type OAuthCallback = <T = AdapterHeaders>(
  callbackParams: CallbackParams,
) => Promise<CallbackResponse<T>>;

interface BotLog {
  request: NormalizedRequest;
  log: ShopifyLogger;
  func: string;
}

const logForBot = ({request, log, func}: BotLog) => {
  log.debug(`Possible bot request to auth ${func}: `, {
    userAgent: request.headers['User-Agent'],
  });
};

export function begin(config: ConfigInterface): OAuthBegin {
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
    const response = await abstractConvertIncomingResponse(adapterArgs);

    let userAgent = request.headers['User-Agent'];
    if (Array.isArray(userAgent)) {
      userAgent = userAgent[0];
    }
    if (isbot(userAgent)) {
      logForBot({request, log, func: 'begin'});
      response.statusCode = 410;
      return abstractConvertResponse(response, adapterArgs);
    }

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

export function callback(config: ConfigInterface): OAuthCallback {
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

    const response = {} as NormalizedResponse;
    let userAgent = request.headers['User-Agent'];
    if (Array.isArray(userAgent)) {
      userAgent = userAgent[0];
    }
    if (isbot(userAgent)) {
      logForBot({request, log, func: 'callback'});
      throw new ShopifyErrors.BotActivityDetected(
        'Invalid OAuth callback initiated by bot',
      );
    }

    log.info('Completing OAuth', {shop});

    const cookies = new Cookies(request, response, {
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

    const cleanShop = sanitizeShop(config)(query.get('shop')!, true)!;

    const postResponse = await fetchRequestFactory(config)(
      `https://${cleanShop}/admin/oauth/access_token`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': DataType.JSON,
          Accept: DataType.JSON,
        },
      },
    );

    if (!postResponse.ok) {
      throwFailedRequest(await postResponse.json(), false, postResponse);
    }

    const session: Session = createSession({
      accessTokenResponse: await postResponse.json<AccessTokenResponse>(),
      shop: cleanShop,
      state: stateFromCookie,
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

function throwIfCustomStoreApp(
  isCustomStoreApp: boolean,
  message: string,
): void {
  if (isCustomStoreApp) {
    throw new ShopifyErrors.PrivateAppError(message);
  }
}
