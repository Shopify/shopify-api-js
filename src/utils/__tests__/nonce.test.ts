import nonce from '../nonce';

test('nonce always returns a new 15 digit random number as a string', () => {
  const firstNonce = nonce();
  const secondNonce = nonce();

  expect(firstNonce.length).toBe(15);
  expect(secondNonce.length).toBe(15);
  expect(typeof firstNonce).toBe('string');
  expect(typeof secondNonce).toBe('string');
});

test('nonce always returns a unique value', () => {
  for (let i = 0; i < 100; i++) {
    const first = nonce();
    const second = nonce();

    expect(first).not.toEqual(second);
  }
});
