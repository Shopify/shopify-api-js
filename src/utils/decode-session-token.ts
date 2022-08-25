import jwt from 'jsonwebtoken';

import {config} from '../config';
import * as ShopifyErrors from '../error';

const JWT_PERMITTED_CLOCK_TOLERANCE = 10;

interface JwtPayload {
  iss: string;
  dest: string;
  aud: string;
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  sid: string;
}

/**
 * Decodes the given session token, and extracts the session information from it
 *
 * @param token Received session token
 */
function decodeSessionToken(token: string): JwtPayload {
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
}

export default decodeSessionToken;

export {decodeSessionToken, JwtPayload};
