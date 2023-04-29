import {crypto} from '../../../runtime/crypto';

export function nonce(): string {
  const cryptoLib =
    typeof (crypto as any)?.webcrypto === 'undefined'
      ? crypto
      : (crypto as any).webcrypto;
  const length = 15;
  const bytes = cryptoLib.getRandomValues(new Uint8Array(length));

  const nonce = bytes
    .map((byte: number) => {
      return byte % 10;
    })
    .join('');

  return nonce;
}
