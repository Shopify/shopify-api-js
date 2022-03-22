import {crypto} from '../adapters/abstract-http';

import {asHex} from './hmac';

export default function nonce(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);

  return asHex(bytes).slice(0, 15);
}
