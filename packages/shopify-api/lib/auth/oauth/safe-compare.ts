import * as ShopifyErrors from '../../error';

export type SafeCompare = (
  strA: string | Record<string, string> | string[] | number[],
  strB: string | Record<string, string> | string[] | number[],
) => boolean;

export const safeCompare: SafeCompare = (strA, strB) => {
  if (typeof strA === typeof strB) {
    const enc = new TextEncoder();
    const buffA = enc.encode(JSON.stringify(strA));
    const buffB = enc.encode(JSON.stringify(strB));

    if (buffA.length === buffB.length) {
      return timingSafeEqual(buffA, buffB);
    }
  } else {
    throw new ShopifyErrors.SafeCompareError(
      `Mismatched data types provided: ${typeof strA} and ${typeof strB}`,
    );
  }
  return false;
};

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
