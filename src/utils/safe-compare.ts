import crypto from 'crypto';

import * as ShopifyErrors from '../error';

export function safeCompare(
  strA: string | {[key: string]: string} | string[] | number[],
  strB: string | {[key: string]: string} | string[] | number[],
): boolean {
  let buffA: Buffer;
  let buffB: Buffer;

  if (typeof strA !== typeof strB) {
    throw new ShopifyErrors.SafeCompareError(
      `Mismatched data types provided: ${typeof strA} and ${typeof strB}`,
    );
  }

  if (typeof strA === 'object') {
    buffA = Buffer.from(JSON.stringify(strA));
  } else {
    buffA = Buffer.from(strA);
  }
  if (typeof strB === 'object') {
    buffB = Buffer.from(JSON.stringify(strB));
  } else {
    buffB = Buffer.from(strB);
  }

  if (buffA.length === buffB.length) {
    return crypto.timingSafeEqual(buffA, buffB);
  }
  return false;
}
