import jwt from 'jsonwebtoken';

import '../../__tests__/shopify-global';
import {JwtPayload} from '../types';
import * as ShopifyErrors from '../../error';

let payload: JwtPayload;

// The tests below are not in a describe block because we need to alter the config object, and we want to start
// each test with a valid config.
beforeEach(() => {
  // Defined here so we can get the initialized config values
  payload = {
    iss: 'test-shop.myshopify.io/admin',
    dest: 'test-shop.myshopify.io',
    aud: global.shopify.config.apiKey,
    sub: '1',
    exp: Date.now() / 1000 + 3600,
    nbf: 1234,
    iat: 1234,
    jti: '4321',
    sid: 'abc123',
  };
});

test('JWT session token can verify valid tokens', () => {
  const token = jwt.sign(payload, global.shopify.config.apiSecretKey, {
    algorithm: 'HS256',
  });

  const actualPayload = global.shopify.utils.decodeSessionToken(token);
  expect(actualPayload).toStrictEqual(payload);
});

test('JWT session token fails with invalid tokens', () => {
  expect(() =>
    global.shopify.utils.decodeSessionToken('not_a_valid_token'),
  ).toThrow(ShopifyErrors.InvalidJwtError);
});

test('JWT session token fails if the token is expired', () => {
  const invalidPayload = {...payload};
  invalidPayload.exp = new Date().getTime() / 1000 - 60;

  const token = jwt.sign(invalidPayload, global.shopify.config.apiSecretKey, {
    algorithm: 'HS256',
  });
  expect(() => global.shopify.utils.decodeSessionToken(token)).toThrow(
    ShopifyErrors.InvalidJwtError,
  );
});

test('JWT session token fails if the token is not activated yet', () => {
  const invalidPayload = {...payload};
  invalidPayload.nbf = new Date().getTime() / 1000 + 60;

  const token = jwt.sign(invalidPayload, global.shopify.config.apiSecretKey, {
    algorithm: 'HS256',
  });
  expect(() => global.shopify.utils.decodeSessionToken(token)).toThrow(
    ShopifyErrors.InvalidJwtError,
  );
});

test('JWT session token fails if the API key is wrong', () => {
  // The token is signed with a key that is not the current value
  const token = jwt.sign(payload, global.shopify.config.apiSecretKey, {
    algorithm: 'HS256',
  });
  global.shopify.config.apiKey = 'something_else';

  expect(() => global.shopify.utils.decodeSessionToken(token)).toThrow(
    ShopifyErrors.InvalidJwtError,
  );
});
