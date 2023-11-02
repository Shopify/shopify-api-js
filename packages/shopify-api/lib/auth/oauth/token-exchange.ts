import {v4 as uuidv4} from 'uuid';

import {decodeSessionToken} from '../../session/decode-session-token';
import {sanitizeShop} from '../../utils/shop-validator';
import {ConfigInterface} from '../../base-types';
import {DataType, RequestReturn} from '../../clients/http_client/types';
import {httpClientClass} from '../../clients/http_client/http_client';
import {Session} from '../../session/session';
import {logger} from '../../logger';
import {getJwtSessionId, getOfflineId} from '../../session/session-utils';
import * as ShopifyErrors from '../../error';

import {
  AccessTokenResponse,
  OnlineAccessInfo,
  OnlineAccessResponse,
} from './types';

export enum RequestedTokenType {
  OnlineAccessToken = 'urn:shopify:params:oauth:token-type:online-access-token',
  OfflineAccessToken = 'urn:shopify:params:oauth:token-type:offline-access-token',
}

export interface TokenExchangeParams {
  shop: string;
  sessionToken: string;
  requestedTokenType: RequestedTokenType;
}

const TokenExchangeGrantType =
  'urn:ietf:params:oauth:grant-type:token-exchange';
const IdTokenType = 'urn:ietf:params:oauth:token-type:id_token';

export function tokenExchange(config: ConfigInterface) {
  return async ({
    shop,
    sessionToken,
    requestedTokenType,
  }: TokenExchangeParams) => {
    const sessionTokenPayload = await decodeSessionToken(config)(sessionToken);

    const cleanShop = sanitizeShop(config)(shop, true)!;
    const cleanDestFromToken = sanitizeShop(config)(
      sessionTokenPayload.dest,
      true,
    )!;

    if (cleanShop !== cleanDestFromToken) {
      throw new ShopifyErrors.InvalidShopError();
    }

    const body = {
      client_id: config.apiKey,
      client_secret: config.apiSecretKey,
      grant_type: TokenExchangeGrantType,
      subject_token: sessionToken,
      subject_token_type: IdTokenType,
      requested_token_type: requestedTokenType,
    };

    const postParams = {
      path: '/admin/oauth/access_token',
      type: DataType.JSON,
      data: body,
      extraHeaders: {
        Accept: DataType.JSON,
      },
    };

    const HttpClient = httpClientClass(config);
    const client = new HttpClient({domain: cleanShop});
    const postResponse = await client.post(postParams);

    return {
      session: createSession({
        postResponse,
        shop,
        config,
      }),
    };
  };

  function createSession({
    config,
    postResponse,
    shop,
  }: {
    config: ConfigInterface;
    postResponse: RequestReturn;
    shop: string;
  }): Session {
    const associatedUser = (postResponse.body as OnlineAccessResponse)
      .associated_user;
    const isOnline = Boolean(associatedUser);

    // We need to keep this as an empty string as our template DB schemas have this required
    const state = '';

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
        state,
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
        state,
        isOnline,
        accessToken: responseBody.access_token,
        scope: responseBody.scope,
      });
    }
  }
}
