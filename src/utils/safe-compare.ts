import crypto from 'crypto';

import * as ShopifyErrors from '../error';

/**
 * A timing safe string comparison utility.
 *
 * @param first any string, array of strings, or object with string values
 * @param second any string, array of strings, or object with string values
 */
export default function safeCompare(
  first: string | { [key: string]: string; } | [string | number],
  second: string | { [key: string]: string; } | [string | number],
): boolean {
  if (typeof first === typeof second) {
    let buff1: Buffer;
    let buff2: Buffer;

    if (typeof first === 'object' && typeof second === 'object') {
      buff1 = Buffer.from(JSON.stringify(first));
      buff2 = Buffer.from(JSON.stringify(second));
    } else {
      buff1 = Buffer.from(first);
      buff2 = Buffer.from(second);
    }

    if (buff1.length === buff2.length) {
      return crypto.timingSafeEqual(buff1, buff2);
    }
  } else {
    throw new ShopifyErrors.SafeCompareError(
      `Mismatched data types provided: ${typeof first} and ${typeof second}`,
    );
  }
  return false;
}
