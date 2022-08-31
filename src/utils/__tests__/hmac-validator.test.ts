import crypto from 'crypto';

import '../../__tests__/shopify-global';
import {AuthQuery} from '../../auth/oauth/types';
import * as ShopifyErrors from '../../error';

test('correctly validates query objects', async () => {
  global.shopify.config.apiSecretKey = 'my super secret key';
  const queryString =
    'code=some+code+goes+here&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=a+number+as+a+string';
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

  await expect(global.shopify.utils.validateHmac(testQuery)).resolves.toBe(
    true,
  );
  await expect(global.shopify.utils.validateHmac(badQuery)).resolves.toBe(
    false,
  );
});

test('queries without hmac key throw InvalidHmacError', async () => {
  const noHmacQuery = {
    code: 'some code goes here',
    timestamp: 'a number as a string',
    state: 'some nonce passed from auth',
    shop: 'the shop URL',
  };

  await expect(
    global.shopify.utils.validateHmac(noHmacQuery),
  ).rejects.toBeInstanceOf(ShopifyErrors.InvalidHmacError);
});

test('queries with extra keys are not included in hmac querystring', async () => {
  global.shopify.config.apiSecretKey = 'my super secret key';
  const queryString =
    'code=some+code+goes+here&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=a+number+as+a+string';
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

  await expect(
    global.shopify.utils.validateHmac(testQueryWithExtraParam),
  ).resolves.toBe(true);
});
