import crypto from 'crypto';
import { ShopifyError } from '../error';

export default function safeCompare(
  a: string | { [key: string]: string } | (string | number)[],
  b: string | { [key: string]: string } | (string | number)[]
): boolean {
  if (typeof a === typeof b) {
    let buffA: Buffer;
    let buffB: Buffer;

    if (typeof a === 'object' && typeof b === 'object') {
      buffA = Buffer.from(JSON.stringify(a));
      buffB = Buffer.from(JSON.stringify(b));
    } else {
      buffA = Buffer.from(a);
      buffB = Buffer.from(b);
    }

    if (buffA.length === buffB.length) {
      return crypto.timingSafeEqual(buffA, buffB);
    }
  } else {
    throw new ShopifyError(
      `Mismatched data types provided: ${typeof a} and ${typeof b}`
    );
  }
  return false;
}
