<<<<<<< HEAD:lib/auth/oauth/__tests__/nonce.test.ts
import {shopify} from '../../../__tests__/test-helper';
=======
import crypto from 'crypto';

import {setCrypto} from '../../runtime/crypto';
import nonce from '../nonce';
>>>>>>> origin/isomorphic/main:src/utils/__tests__/nonce.test.ts

setCrypto(crypto.webcrypto as any);

test('nonce always returns a new 15 digit random number as a string', () => {
  const firstNonce = shopify.auth.nonce();
  const secondNonce = shopify.auth.nonce();

  expect(firstNonce.length).toBe(15);
  expect(secondNonce.length).toBe(15);
  expect(typeof firstNonce).toBe('string');
  expect(typeof secondNonce).toBe('string');
});

test('nonce always returns a unique value', () => {
  for (let i = 0; i < 100; i++) {
    const first = shopify.auth.nonce();
    const second = shopify.auth.nonce();

    expect(first).not.toEqual(second);
  }
});
