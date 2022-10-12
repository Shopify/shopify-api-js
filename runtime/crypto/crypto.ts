// The mutable export is the whole key to the adapter architecture.

// eslint-disable-next-line import/no-mutable-exports
export let crypto: Crypto;
export function setCrypto(providedCrypto: Crypto) {
  crypto = providedCrypto;
}
