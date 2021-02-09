import crypto from 'crypto';

export default function nonce(): string {
  const length = 15;
  const bytes = crypto.randomBytes(length);

  const nonce = bytes
    .map((byte) => {
      return byte % 10;
    })
    .join('');

  return nonce;
}
