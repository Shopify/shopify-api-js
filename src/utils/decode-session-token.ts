import * as jose from 'jose';

import {Context} from '../context';
import * as ShopifyErrors from '../error';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD

const JWT_PERMITTED_CLOCK_TOLERANCE = 10;

=======

=======
=======

>>>>>>> origin/isomorphic/main
import {getHMACKey} from './get-hmac-key';
>>>>>>> origin/isomorphic/crypto
import validateShop from './shop-validator';

>>>>>>> e83b5faf (Run yarn lint --fix on all files)
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
<<<<<<< HEAD
<<<<<<< HEAD
    payload = jwt.verify(token, Context.API_SECRET_KEY, {
      algorithms: ['HS256'],
      clockTolerance: JWT_PERMITTED_CLOCK_TOLERANCE,
    }) as JwtPayload;
=======
    payload = (
      await jose.jwtVerify(token, getHMACKey(Context.API_SECRET_KEY), {
        algorithms: ['HS256'],
        clockTolerance: JWT_PERMITTED_CLOCK_TOLERANCE,
      })
    ).payload as unknown as JwtPayload;
>>>>>>> origin/isomorphic/crypto
  } catch (error) {
    throw new ShopifyErrors.InvalidJwtError(
      `Failed to parse session token '${token}': ${error.message}`,
    );
=======
    payload = jwt.verify(token, Context.API_SECRET_KEY, {algorithms: ['HS256']}) as JwtPayload;
  } catch (e) {
    throw new ShopifyErrors.InvalidJwtError(`Failed to parse session token '${token}': ${e.message}`);
>>>>>>> e83b5faf (Run yarn lint --fix on all files)
  }

  // The exp and nbf fields are validated by the JWT library

  if (payload.aud !== Context.API_KEY) {
    throw new ShopifyErrors.InvalidJwtError(
      'Session token had invalid API key',
    );
  }

  return payload;
}

export {decodeSessionToken, JwtPayload};
