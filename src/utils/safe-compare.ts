import crypto from 'crypto';

import * as ShopifyErrors from '../error';

/**
 * A timing safe string comparison utility.
 *
 * @param a any string, array of strings, or object with string values
 * @param b any string, array of strings, or object with string values
 */
export default function safeCompare(
  a: string | { [key: string]: string; } | Array<string | number>,
  b: string | { [key: string]: string; } | Array<string | number>,
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
    throw new ShopifyErrors.SafeCompareError(
      `Mismatched data types provided: ${typeof a} and ${typeof b}`,
    );
  }
  return false;
}
