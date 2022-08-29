import {crypto} from '../runtime/crypto';

export function nonce(): string {
  const length = 15;
  const bytes = crypto.getRandomValues(new Uint8Array(length));

  const nonce = bytes
    .map((byte: number) => {
      return byte % 10;
    })
    .join('');

  return nonce;
}
