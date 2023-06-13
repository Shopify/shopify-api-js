import crypto from 'crypto';

import {setCrypto} from '../../runtime/crypto';
import validateHmac from '../hmac-validator';
import {AuthQuery} from '../../auth/types';
import * as ShopifyErrors from '../../error';
import {Context} from '../../context';

setCrypto(crypto.webcrypto as any);

test('correctly validates query objects', async () => {
  Context.API_SECRET_KEY = 'my super secret key';
  const queryString =
    'code=some+code+goes+here&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=a+number+as+a+string';
  const queryObjectWithoutHmac = {
    code: 'some code goes here',
    shop: 'the shop URL',
    state: 'some nonce passed from auth',
    timestamp: 'a number as a string',
  };
  const localHmac = crypto
    .createHmac('sha256', Context.API_SECRET_KEY)
    .update(queryString)
    .digest('base64');

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

  await expect(async () => {
    await validateHmac(noHmacQuery);
  }).rejects.toThrowError(ShopifyErrors.InvalidHmacError);
});
<<<<<<< HEAD:src/utils/test/hmac-validator.test.ts
=======

test('queries with extra keys are not included in hmac querystring', async () => {
  Context.API_SECRET_KEY = 'my super secret key';
  const queryString =
    'code=some+code+goes+here&shop=the+shop+URL&state=some+nonce+passed+from+auth&timestamp=a+number+as+a+string';
  const queryObjectWithoutHmac = {
    code: 'some code goes here',
    shop: 'the shop URL',
    state: 'some nonce passed from auth',
    timestamp: 'a number as a string',
  };
  const localHmac = crypto
    .createHmac('sha256', Context.API_SECRET_KEY)
    .update(queryString)
    .digest('base64');

  const testQueryWithExtraParam = Object.assign(queryObjectWithoutHmac, {
    hmac: localHmac,
    shopify: ['callback'],
  });

  await expect(validateHmac(testQueryWithExtraParam)).resolves.toBe(true);
});
>>>>>>> origin/isomorphic/main:src/utils/__tests__/hmac-validator.test.ts
