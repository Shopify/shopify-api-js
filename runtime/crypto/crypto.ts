// The mutable export is the whole key to the adapter architecture.

// eslint-disable-next-line import/no-mutable-exports
let cryptoVar: Crypto;

try {
  cryptoVar = crypto;
} catch (_e) {
  // This will fail for Node, but we're explicitly calling the below function to set it
}

export function setCrypto(crypto: Crypto): void {
  cryptoVar = crypto;
}

export {cryptoVar as crypto};
