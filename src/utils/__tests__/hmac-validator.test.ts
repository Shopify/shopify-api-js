import crypto from 'crypto';

import '../../__tests__/shopify-global';
import {AuthQuery} from '../../auth/oauth/types';
import * as ShopifyErrors from '../../error';

test('correctly validates query objects', () => {
  global.shopify.config.apiSecretKey = 'my super secret key';
  const queryString =
    'code=some%20code%20goes%20here&shop=the%20shop%20URL&state=some%20nonce%20passed%20from%20auth&timestamp=a%20number%20as%20a%20string';
  const queryObjectWithoutHmac = {
    code: 'some code goes here',
    shop: 'the shop URL',
    state: 'some nonce passed from auth',
    timestamp: 'a number as a string',
  };
  const localHmac = crypto
    .createHmac('sha256', global.shopify.config.apiSecretKey)
    .update(queryString)
    .digest('hex');

  const testQuery: AuthQuery = Object.assign(queryObjectWithoutHmac, {
    hmac: localHmac,
  });

  const badQuery: AuthQuery = {
    code: 'some code goes here',
    hmac: 'incorrect_hmac_string',
    timestamp: 'a number as a string',
    state: 'some nonce passed from auth',
    shop: 'the shop URL',
  };

  expect(global.shopify.utils.validateHmac(testQuery)).toBe(true);
  expect(global.shopify.utils.validateHmac(badQuery)).toBe(false);
});

test('queries without hmac key throw InvalidHmacError', () => {
  const noHmacQuery = {
    code: 'some code goes here',
    timestamp: 'a number as a string',
    state: 'some nonce passed from auth',
    shop: 'the shop URL',
  };

  expect(() => {
    global.shopify.utils.validateHmac(noHmacQuery);
  }).toThrowError(ShopifyErrors.InvalidHmacError);
});

test('queries with extra keys are not included in hmac querystring', () => {
  global.shopify.config.apiSecretKey = 'my super secret key';
  const queryString =
    'code=some%20code%20goes%20here&shop=the%20shop%20URL&state=some%20nonce%20passed%20from%20auth&timestamp=a%20number%20as%20a%20string';
  const queryObjectWithoutHmac = {
    code: 'some code goes here',
    shop: 'the shop URL',
    state: 'some nonce passed from auth',
    timestamp: 'a number as a string',
  };
  const localHmac = crypto
    .createHmac('sha256', global.shopify.config.apiSecretKey)
    .update(queryString)
    .digest('hex');

  const testQueryWithExtraParam = Object.assign(queryObjectWithoutHmac, {
    hmac: localHmac,
    shopify: ['callback'],
  });

  expect(global.shopify.utils.validateHmac(testQueryWithExtraParam)).toBe(true);
});
