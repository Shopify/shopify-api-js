import {crypto} from '../../../runtime/crypto';

export function nonce(): string {
  const length = 15;

  // eslint-disable-next-line no-warning-comments
  // TODO Remove the randomBytes call when dropping Node 14 support
  const bytes = crypto.getRandomValues
    ? crypto.getRandomValues(new Uint8Array(length))
    : (crypto as any).randomBytes(length);

  const nonce = bytes
    .map((byte: number) => {
      return byte % 10;
    })
    .join('');

  return nonce;
}
