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
<<<<<<< HEAD
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
=======
  if (typeof strA === typeof strB) {
    const enc = new TextEncoder();
    const buffA = enc.encode(JSON.stringify(strA));
    const buffB = enc.encode(JSON.stringify(strB));
>>>>>>> origin/isomorphic/main

    if (buffA.length === buffB.length) {
      return timingSafeEqual(buffA, buffB);
    }
  } else {
    throw new ShopifyErrors.SafeCompareError(
      `Mismatched data types provided: ${typeof a} and ${typeof b}`,
    );
  }
  return false;
}

// Buffer must be same length for this function to be secure.
function timingSafeEqual(bufA: ArrayBuffer, bufB: ArrayBuffer): boolean {
  const viewA = new Uint8Array(bufA);
  const viewB = new Uint8Array(bufB);
  let out = 0;
  for (let i = 0; i < viewA.length; i++) {
    out |= viewA[i] ^ viewB[i];
  }
  return out === 0;
}
