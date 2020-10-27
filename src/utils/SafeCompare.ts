import crypto from 'crypto';

export default function safeCompare(
  a: string | object | any[],
  b: string | object | any[]
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
  }

  return false;
}
