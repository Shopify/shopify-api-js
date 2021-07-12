import '../../test/test_helper';

import jwt from 'jsonwebtoken';

import decodeSessionToken, {JwtPayload} from '../decode-session-token';
import {Context} from '../../context';
import * as ShopifyErrors from '../../error';

let payload: JwtPayload;

// The tests below are not in a describe block because we need to alter the Context object, and we want to start
// each test with a valid Context.
beforeEach(() => {
  // Defined here so we can get the initialized Context values
  payload = {
    iss: 'test-shop.myshopify.io/admin',
    dest: 'test-shop.myshopify.io',
    aud: Context.API_KEY,
    sub: '1',
    exp: Date.now() / 1000 + 3600,
    nbf: 1234,
    iat: 1234,
    jti: '4321',
    sid: 'abc123',
  };
});

test('JWT session token can verify valid tokens', () => {
  const token = jwt.sign(payload, Context.API_SECRET_KEY, {
    algorithm: 'HS256',
  });

  const actualPayload = decodeSessionToken(token);
  expect(actualPayload).toStrictEqual(payload);
});

test('JWT session token fails with invalid tokens', () => {
  expect(() => decodeSessionToken('not_a_valid_token')).toThrow(
    ShopifyErrors.InvalidJwtError,
  );
});

test('JWT session token fails if the token is expired', () => {
  const invalidPayload = {...payload};
  invalidPayload.exp = new Date().getTime() / 1000 - 60;

  const token = jwt.sign(invalidPayload, Context.API_SECRET_KEY, {
    algorithm: 'HS256',
  });
  expect(() => decodeSessionToken(token)).toThrow(
    ShopifyErrors.InvalidJwtError,
  );
});

test('JWT session token fails if the token is not activated yet', () => {
  const invalidPayload = {...payload};
  invalidPayload.nbf = new Date().getTime() / 1000 + 60;

  const token = jwt.sign(invalidPayload, Context.API_SECRET_KEY, {
    algorithm: 'HS256',
  });
  expect(() => decodeSessionToken(token)).toThrow(
    ShopifyErrors.InvalidJwtError,
  );
});

test('JWT session token fails if the API key is wrong', () => {
  // The token is signed with a key that is not the current value
  const token = jwt.sign(payload, Context.API_SECRET_KEY, {
    algorithm: 'HS256',
  });
  Context.API_KEY = 'something_else';

  expect(() => decodeSessionToken(token)).toThrow(
    ShopifyErrors.InvalidJwtError,
  );
});

test('JWT session token fails if the domain is invalid', () => {
  const invalidPayload = {...payload};
  invalidPayload.dest = 'https://not-a-domain';

  const token = jwt.sign(invalidPayload, Context.API_SECRET_KEY, {
    algorithm: 'HS256',
  });
  expect(() => decodeSessionToken(token)).toThrow(
    ShopifyErrors.InvalidJwtError,
  );
});
