import jwt from 'jsonwebtoken';

import * as ShopifyErrors from '../error';

import {JwtPayload} from './types';

const JWT_PERMITTED_CLOCK_TOLERANCE = 10;

export function decodeSessionToken(
  apiKey: string,
  apiSecretKey: string,
  token: string,
): JwtPayload {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, apiSecretKey, {
      algorithms: ['HS256'],
      clockTolerance: JWT_PERMITTED_CLOCK_TOLERANCE,
    }) as JwtPayload;
  } catch (error) {
    throw new ShopifyErrors.InvalidJwtError(
      `Failed to parse session token '${token}': ${error.message}`,
    );
  }

  // The exp and nbf fields are validated by the JWT library

  if (payload.aud !== apiKey) {
    throw new ShopifyErrors.InvalidJwtError(
      'Session token had invalid API key',
    );
  }

  return payload;
}
