import validateHmac from '../hmac-validator';
import { AuthQueryObject } from '../../auth/types';
import { InvalidHmacError } from '../../error';

test('correctly validates query objects', () => {
  const testQuery: AuthQueryObject = {
    code: 'some code goes here',
    hmac: '3a95433f2b2126c305c90ee20b80822d12a662d3183d533599ed86dabc3d1bd0',
    timestamp: 'a number as a string',
    state: 'some nonce passed from auth',
    shop: 'the shop URL',
  };

  const badQuery: AuthQueryObject = {
    code: 'some code goes here',
    hmac: 'incorrect_hmac_string',
    timestamp: 'a number as a string',
    state: 'some nonce passed from auth',
    shop: 'the shop URL',
  };

  expect(validateHmac(testQuery)).toBe(true);
  expect(validateHmac(badQuery)).toBe(false);
});

test('queries without hmac key throw InvalidHmacError', () => {
  const noHmacQuery = {
    code: 'some code goes here',
    timestamp: 'a number as a string',
    state: 'some nonce passed from auth',
    shop: 'the shop URL',
  };

  expect(() => {
    validateHmac(noHmacQuery);
  }).toThrowError(InvalidHmacError);
});
