import * as ShopifyErrors from '../../error';

type SafeCompareParam = string | {[key: string]: string} | string[] | number[];
/**
 * Takes a pair of arguments of any of the following types and returns true if they are identical, both in term of type and content.
 * @param {SafeCompareParam} item1 first value to compare
 * @param {SafeCompareParam} item2 second value to compare
 * @returns {boolean} whether the two input values are equal
 */
export function safeCompare(
  item1: SafeCompareParam,
  item2: SafeCompareParam,
): boolean {
  if (typeof item1 === typeof item2) {
    const enc = new TextEncoder();
    const buffA = enc.encode(JSON.stringify(item1));
    const buffB = enc.encode(JSON.stringify(item2));

    if (buffA.length === buffB.length) {
      return timingSafeEqual(buffA, buffB);
    }
  } else {
    throw new ShopifyErrors.SafeCompareError(
      `Mismatched data types provided: ${typeof item1} and ${typeof item2}`,
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
