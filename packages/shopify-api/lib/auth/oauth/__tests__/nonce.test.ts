import {shopifyApi} from '../../..';
import {testConfig} from '../../../__tests__/test-config';

test('nonce always returns a new 15 digit random number as a string', () => {
  const shopify = shopifyApi(testConfig());

  const firstNonce = shopify.auth.nonce();
  const secondNonce = shopify.auth.nonce();

  expect(firstNonce.length).toBe(15);
  expect(secondNonce.length).toBe(15);
  expect(typeof firstNonce).toBe('string');
  expect(typeof secondNonce).toBe('string');
});

test('nonce always returns a unique value', () => {
  const shopify = shopifyApi(testConfig());

  for (let i = 0; i < 100; i++) {
    const first = shopify.auth.nonce();
    const second = shopify.auth.nonce();

    expect(first).not.toEqual(second);
  }
});
