import {v4 as uuidv4} from 'uuid';

import {Session} from '../../session/session';
import {ConfigInterface} from '../../base-types';
import {RequestReturn} from '../../clients/http_client/types';
import {logger} from '../../logger';
import {getJwtSessionId, getOfflineId} from '../../session/session-utils';

import {
  AccessTokenResponse,
  OnlineAccessResponse,
  OnlineAccessInfo,
} from './types';

export function createSession({
  config,
  postResponse,
  shop,
  state,
}: {
  config: ConfigInterface;
  postResponse: RequestReturn;
  shop: string;
  state: string;
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
