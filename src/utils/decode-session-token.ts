import * as jose from 'jose';

import {Context} from '../context';
import * as ShopifyErrors from '../error';

import {getHMACKey} from './get-hmac-key';
import validateShop from './shop-validator';

const JWT_PERMITTED_CLOCK_TOLERANCE = 5;

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
export default async function decodeSessionToken(
  token: string,
): Promise<JwtPayload> {
  let payload: JwtPayload;
  try {
    payload = (
      await jose.jwtVerify(token, getHMACKey(Context.API_SECRET_KEY), {
        algorithms: ['HS256'],
        clockTolerance: JWT_PERMITTED_CLOCK_TOLERANCE,
      })
    ).payload as unknown as JwtPayload;
  } catch (error) {
    throw new ShopifyErrors.InvalidJwtError(
      `Failed to parse session token '${token}': ${error.message}`,
    );
  }

  // The exp and nbf fields are validated by the JWT library

  if (payload.aud !== Context.API_KEY) {
    throw new ShopifyErrors.InvalidJwtError(
      'Session token had invalid API key',
    );
  }

  if (!validateShop(payload.dest.replace(/^https:\/\//, ''))) {
    throw new ShopifyErrors.InvalidJwtError('Session token had invalid shop');
  }

  return payload;
}

export {decodeSessionToken, JwtPayload};
