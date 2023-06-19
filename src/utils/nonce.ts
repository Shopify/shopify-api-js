<<<<<<< HEAD
export default function nonce(): string {
  const length = 15;
  let n = '';

  for (let i = 0; i <= 3; i++) {
    n += Math.round(Number(new Date()) * Math.random());
  }

  const s = n.substr(n.length - length);
  return s;
=======
import {crypto, asHex} from '../runtime/crypto';

export default function nonce(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);

  return asHex(bytes).slice(0, 15);
>>>>>>> origin/isomorphic/main
}
