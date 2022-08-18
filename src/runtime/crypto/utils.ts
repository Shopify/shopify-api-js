import {crypto} from './crypto';

export async function createSHA256HMAC(
  secret: string,
  payload: string,
): Promise<string> {
  const enc = new TextEncoder();
  const key = await (crypto as any).subtle.importKey(
    'raw',
    enc.encode(secret),
    {
      name: 'HMAC',
      hash: {name: 'SHA-256'},
    },
    false,
    ['sign'],
  );

  const signature = await (crypto as any).subtle.sign(
    'HMAC',
    key,
    enc.encode(payload),
  );
  return asBase64(signature);
}

export function asHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

const LookupTable =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
export function asBase64(buffer: ArrayBuffer): string {
  let output = '';

  const input = new Uint8Array(buffer);
  for (let i = 0; i < input.length; ) {
    const byte1 = input[i++];
    const byte2 = input[i++];
    const byte3 = input[i++];

    const enc1 = byte1 >> 2;
    const enc2 = ((byte1 & 0b00000011) << 4) | (byte2 >> 4);
    let enc3 = ((byte2 & 0b00001111) << 2) | (byte3 >> 6);
    let enc4 = byte3 & 0b00111111;

    if (isNaN(byte2)) {
      enc3 = 64;
    }
    if (isNaN(byte3)) {
      enc4 = 64;
    }

    output +=
      LookupTable[enc1] +
      LookupTable[enc2] +
      LookupTable[enc3] +
      LookupTable[enc4];
  }
  return output;
}

export async function hashStringWithSHA256(input: string): Promise<string> {
  const buffer = new TextEncoder().encode(input);
  const hash = await (crypto as any).subtle.digest({name: 'SHA-256'}, buffer);
  return asHex(hash);
}
