import crypto from 'crypto';

import {shopify} from '../../__tests__/test-helper';
import {AuthQuery} from '../../auth/oauth/types';
import * as ShopifyErrors from '../../error';

test('correctly validates query objects and timestamp', async () => {
  shopify.config.apiSecretKey = 'my super secret key';
  const submittedTimestamp = String(Date.now() - 5000);
  const queryString = `code=some+code+goes+here&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=${submittedTimestamp}`;
  const queryObjectWithoutHmac = {
    code: 'some code goes here',
    shop: 'the shop URL',
    state: 'some nonce passed from auth',
    timestamp: submittedTimestamp,
  };

  const localHmac = crypto
    .createHmac('sha256', shopify.config.apiSecretKey)
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

  const validateHmac = shopify.utils.validateHmac;
  await expect(validateHmac(testQuery)).resolves.toBe(true);
  await expect(validateHmac(badQuery)).resolves.toBe(false);
});

test('queries without hmac key throw InvalidHmacError', async () => {
  const noHmacQuery = {
    code: 'some code goes here',
    timestamp: 'a number as a string',
    state: 'some nonce passed from auth',
    shop: 'the shop URL',
  };

  await expect(shopify.utils.validateHmac(noHmacQuery)).rejects.toBeInstanceOf(
    ShopifyErrors.InvalidHmacError,
  );
});

test('queries with extra keys are included in hmac querystring', async () => {
  shopify.config.apiSecretKey = 'my super secret key';
  // NB: keys are listed alphabetically
  const queryString =
    'code=some+code+goes+here&foo=bar&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=a+number+as+a+string';
  const queryObjectWithoutHmac = {
    code: 'some code goes here',
    foo: 'bar',
    shop: 'the shop URL',
    state: 'some nonce passed from auth',
    timestamp: 'a number as a string',
  };
  const localHmac = crypto
    .createHmac('sha256', shopify.config.apiSecretKey)
    .update(queryString)
    .digest('hex');

  const queryObjectWithHmac: AuthQuery = Object.assign(queryObjectWithoutHmac, {
    hmac: localHmac,
  });

  await expect(shopify.utils.validateHmac(queryObjectWithHmac)).resolves.toBe(
    true,
  );
});

test('hmac with timestamp older than 10 seconds throws InvalidHmacError', async () => {
  shopify.config.apiSecretKey = 'my super secret key';
  const submittedTimestamp = String(Date.now() - 11000);
  const queryString = `code=some+code+goes+here&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=${submittedTimestamp}`;
  const queryObjectWithoutHmac = {
    code: 'some code goes here',
    shop: 'the shop URL',
    state: 'some nonce passed from auth',
    timestamp: submittedTimestamp,
  };

  const localHmac = crypto
    .createHmac('sha256', shopify.config.apiSecretKey)
    .update(queryString)
    .digest('hex');

  const testQuery: AuthQuery = Object.assign(queryObjectWithoutHmac, {
    hmac: localHmac,
  });

  const validateHmac = shopify.utils.validateHmac;
  await expect(validateHmac(testQuery)).rejects.toBeInstanceOf(
    ShopifyErrors.InvalidHmacError,
  );
});
