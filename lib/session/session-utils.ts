import {ConfigInterface} from '../base-types';
import {SESSION_COOKIE_NAME} from '../auth/oauth/types';
import {
  abstractConvertRequest,
  Cookies,
  NormalizedResponse,
} from '../../runtime/http';
import {sanitizeShop} from '../utils/shop-validator';
import {logger} from '../logger';
import * as ShopifyErrors from '../error';

import {decodeSessionToken} from './decode-session-token';
import type {GetCurrentSessionIdParams} from './types';
import {Session} from './session';

export function getJwtSessionId(config: ConfigInterface) {
  return (shop: string, userId: string): string => {
    return `${sanitizeShop(config)(shop, true)}_${userId}`;
  };
}

export function getOfflineId(config: ConfigInterface) {
  return (shop: string): string => {
    return `offline_${sanitizeShop(config)(shop, true)}`;
  };
}

export function getCurrentSessionId(config: ConfigInterface) {
  return async function getCurrentSessionId({
    isOnline,
    ...adapterArgs
  }: GetCurrentSessionIdParams): Promise<string | undefined> {
    const request = await abstractConvertRequest(adapterArgs);

    const log = logger(config);

    if (config.isEmbeddedApp) {
      log.debug('App is embedded, looking for session id in JWT payload', {
        isOnline,
      });

      const authHeader = request.headers.Authorization;
      if (authHeader) {
        const matches = (
          typeof authHeader === 'string' ? authHeader : authHeader[0]
        ).match(/^Bearer (.+)$/);
        if (!matches) {
          log.error('Missing Bearer token in authorization header', {isOnline});

          throw new ShopifyErrors.MissingJwtTokenError(
            'Missing Bearer token in authorization header',
          );
        }

        const jwtPayload = await decodeSessionToken(config)(matches[1]);
        const shop = jwtPayload.dest.replace(/^https:\/\//, '');

        log.debug('Found valid JWT payload', {shop, isOnline});

        if (isOnline) {
          return getJwtSessionId(config)(shop, jwtPayload.sub);
        } else {
          return getOfflineId(config)(shop);
        }
      } else {
        log.error(
          'Missing Authorization header, was the request made with authenticatedFetch?',
          {isOnline},
        );
      }
    } else {
      log.debug('App is not embedded, looking for session id in cookies', {
        isOnline,
      });

      const cookies = new Cookies(request, {} as NormalizedResponse, {
        keys: [config.apiSecretKey],
      });
      return cookies.getAndVerify(SESSION_COOKIE_NAME);
    }

    return undefined;
  };
}

export function customAppSession(config: ConfigInterface) {
  return (shop: string): Session => {
    return new Session({
      id: '',
      shop: `${sanitizeShop(config)(shop, true)}`,
      state: '',
      isOnline: false,
    });
  };
}
