import jwt from 'jsonwebtoken';

import {ConfigInterface} from '../base-types';
import * as ShopifyErrors from '../error';

import {JwtPayload} from './types';

const JWT_PERMITTED_CLOCK_TOLERANCE = 10;

export function createDecodeSessionToken(config: ConfigInterface) {
  return (token: string): JwtPayload => {
    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, config.apiSecretKey, {
        algorithms: ['HS256'],
        clockTolerance: JWT_PERMITTED_CLOCK_TOLERANCE,
      }) as JwtPayload;
    } catch (error) {
      throw new ShopifyErrors.InvalidJwtError(
        `Failed to parse session token '${token}': ${error.message}`,
      );
    }

    // The exp and nbf fields are validated by the JWT library

    if (payload.aud !== config.apiKey) {
      throw new ShopifyErrors.InvalidJwtError(
        'Session token had invalid API key',
      );
    }

    return payload;
  };
}
