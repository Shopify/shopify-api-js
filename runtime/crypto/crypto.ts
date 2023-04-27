// The mutable export is the whole key to the adapter architecture.

// eslint-disable-next-line import/no-mutable-exports
let cryptoVar: Crypto;
if (typeof crypto === 'undefined') {
  // CF worker will complain about a line reading require('crypto') even if it's never executed, as is the case here,
  // so we create a hacky workaround to make it happy.
  const cfWorkerWorkaround = 'crypto';
  cryptoVar = require(cfWorkerWorkaround);
} else {
  cryptoVar = crypto;
}

export function setCrypto(_crypto: Crypto): void {
  // deprecated
  console.log(
    '[shopify-api/WARNING] [Deprecated | 8.0.0] The setCrypto function is no longer necessary, and has been ' +
      'deprecated. You should stop calling it from your adapter, as it will be removed in a future release.',
  );
}

export {cryptoVar as crypto};
