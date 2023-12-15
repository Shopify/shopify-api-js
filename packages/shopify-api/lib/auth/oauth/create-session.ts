import {v4 as uuidv4} from 'uuid';

import {Session} from '../../session/session';
import {ConfigInterface} from '../../base-types';
import {logger} from '../../logger';
import {getJwtSessionId, getOfflineId} from '../../session/session-utils';

import {
  AccessTokenResponse,
  OnlineAccessResponse,
  OnlineAccessInfo,
} from './types';

export function createSession({
  config,
  accessTokenResponse,
  shop,
  state,
}: {
  config: ConfigInterface;
  accessTokenResponse: AccessTokenResponse;
  shop: string;
  state: string;
}): Session {
  const associatedUser = (accessTokenResponse as OnlineAccessResponse)
    .associated_user;
  const isOnline = Boolean(associatedUser);

  logger(config).info('Creating new session', {shop, isOnline});

  if (isOnline) {
    let sessionId: string;
    const responseBody = accessTokenResponse as OnlineAccessResponse;
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
    return new Session({
      id: getOfflineId(config)(shop),
      shop,
      state,
      isOnline,
      accessToken: accessTokenResponse.access_token,
      scope: accessTokenResponse.scope,
    });
  }
}
