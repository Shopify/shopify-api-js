import crypto from 'crypto';

import {shopify} from '../../__tests__/test-helper';
import {AuthQuery} from '../../auth/oauth/types';
import * as ShopifyErrors from '../../error';
import {getCurrentTimeInSec} from '../hmac-validator';

test('correctly validates query objects and timestamp', async () => {
  shopify.config.apiSecretKey = 'my super secret key';
  const submittedTimestamp = String(getCurrentTimeInSec() - 60);
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

  const testQueryWithHmac: AuthQuery = Object.assign(queryObjectWithoutHmac, {
    hmac: localHmac,
  });

  const testQueryWithSignature: AuthQuery = Object.assign(
    queryObjectWithoutHmac,
    {
      signature: localHmac,
    },
  );

  const badQuery: AuthQuery = {
    code: 'some code goes here',
    hmac: 'incorrect_hmac_string',
    timestamp: 'a number as a string',
    state: 'some nonce passed from auth',
    shop: 'the shop URL',
  };

  const validateHmac = shopify.utils.validateHmac;
  await expect(validateHmac(testQueryWithHmac)).resolves.toBe(true);
  await expect(validateHmac(testQueryWithSignature)).resolves.toBe(true);
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
  const queryObjectWithSignature: AuthQuery = Object.assign(
    queryObjectWithoutHmac,
    {
      signature: localHmac,
    },
  );

  await expect(shopify.utils.validateHmac(queryObjectWithHmac)).resolves.toBe(
    true,
  );
  await expect(
    shopify.utils.validateHmac(queryObjectWithSignature),
  ).resolves.toBe(true);
});

test('hmac with timestamp older than 10 seconds throws InvalidHmacError', async () => {
  shopify.config.apiSecretKey = 'my super secret key';
  const submittedTimestamp = String(getCurrentTimeInSec() - 91);
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

  const testQueryWithHmac: AuthQuery = Object.assign(queryObjectWithoutHmac, {
    hmac: localHmac,
  });

  const testQueryWithSignature: AuthQuery = Object.assign(
    queryObjectWithoutHmac,
    {
      signature: localHmac,
    },
  );

  const validateHmac = shopify.utils.validateHmac;
  await expect(validateHmac(testQueryWithHmac)).rejects.toBeInstanceOf(
    ShopifyErrors.InvalidHmacError,
  );
  await expect(validateHmac(testQueryWithSignature)).rejects.toBeInstanceOf(
    ShopifyErrors.InvalidHmacError,
  );
});

test('hmac with timestamp more than 10 seconds in the future throws InvalidHmacError', async () => {
  shopify.config.apiSecretKey = 'my super secret key';
  const submittedTimestamp = String(getCurrentTimeInSec() + 91);
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

  const testQueryWithHmac: AuthQuery = Object.assign(queryObjectWithoutHmac, {
    hmac: localHmac,
  });

  const testQueryWithSignature: AuthQuery = Object.assign(
    queryObjectWithoutHmac,
    {
      signature: localHmac,
    },
  );

  const validateHmac = shopify.utils.validateHmac;
  await expect(validateHmac(testQueryWithHmac)).rejects.toBeInstanceOf(
    ShopifyErrors.InvalidHmacError,
  );
  await expect(validateHmac(testQueryWithSignature)).rejects.toBeInstanceOf(
    ShopifyErrors.InvalidHmacError,
  );
});
