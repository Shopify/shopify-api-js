export interface Headers {
  [key: string]: string | string[];
}

export interface Request {
  method: string;
  url: string;
  headers: Headers;
  body?: string;
}

export interface Response {
  statusCode: number;
  statusText: string;
  headers?: Headers;
  body?: string;
}

export type AbstractFetchFunc = (req: Request) => Promise<Response>;
// The mutable export is the whole key to the adapter architecture.
// eslint-disable-next-line import/no-mutable-exports
export let abstractFetch: AbstractFetchFunc;
export function setAbstractFetchFunc(func: AbstractFetchFunc) {
  abstractFetch = func;
}

// The mutable export is the whole key to the adapter architecture.
// eslint-disable-next-line import/no-mutable-exports
export let crypto: Crypto;
export function setCrypto(providedCrypto: Crypto) {
  crypto = providedCrypto;
}

export function isOK(resp: Response) {
  // https://fetch.spec.whatwg.org/#ok-status
  return resp.statusCode >= 200 && resp.statusCode <= 299;
}

export function canonicalizeHeaderName(hdr: string): string {
  return hdr.replace(
    /(^|-)(\w+)/g,
    (_fullMatch, start, letters) =>
      start +
      letters.slice(0, 1).toUpperCase() +
      letters.slice(1).toLowerCase(),
  );
}

export function getHeaders(
  headers: Headers | undefined,
  needle_: string,
): string[] {
  const result: string[] = [];
  if (!headers) return result;
  const needle = canonicalizeHeaderName(needle_);
  for (const [key, values] of Object.entries(headers)) {
    if (canonicalizeHeaderName(key) !== needle) continue;
    if (Array.isArray(values)) {
      result.push(...values);
    } else {
      result.push(values);
    }
  }
  return result;
}

export function getHeader(
  headers: Headers | undefined,
  needle: string,
): string | undefined {
  if (!headers) return undefined;
  return getHeaders(headers, needle)?.[0];
}

export function setHeader(headers: Headers, key: string, value: string) {
  canonicalizeHeaders(headers);
  headers[canonicalizeHeaderName(key)] = [value];
}

export function addHeader(headers: Headers, key: string, value: string) {
  canonicalizeHeaders(headers);
  const canonKey = canonicalizeHeaderName(key);
  let list = headers[canonKey];
  if (!list) {
    list = [];
  } else if (!Array.isArray(list)) {
    list = [list];
  }
  headers[canonKey] = list;
  list.push(value);
}

function canonicalizeValue(value: any): any {
  if (typeof value === 'number') return value.toString();
  return value;
}

export function canonicalizeHeaders(hdr: Headers): Headers {
  for (const [key, values] of Object.entries(hdr)) {
    const canonKey = canonicalizeHeaderName(key);
    if (!hdr[canonKey]) hdr[canonKey] = [];
    if (!Array.isArray(hdr[canonKey]))
      hdr[canonKey] = [canonicalizeValue(hdr[canonKey])];
    if (key === canonKey) continue;
    delete hdr[key];
    (hdr[canonKey] as any).push(
      ...[values].flat().map((value) => canonicalizeValue(value)),
    );
  }
  return hdr;
}

export function removeHeader(headers: Headers, needle: string) {
  canonicalizeHeaders(headers);
  const canonKey = canonicalizeHeaderName(needle);
  delete headers[canonKey];
}

export interface CookieData {
  name: string;
  value: string;
  /**
   * a number representing the milliseconds from Date.now() for expiry
   */
  maxAge?: number;
  /**
   * a Date object indicating the cookie's expiration
   * date (expires at the end of session by default).
   */
  expires?: Date;
  /**
   * a string indicating the path of the cookie (/ by default).
   */
  path?: string;
  /**
   * a string indicating the domain of the cookie (no default).
   */
  domain?: string;
  /**
   * a boolean indicating whether the cookie is only to be sent
   * over HTTPS (false by default for HTTP, true by default for HTTPS).
   */
  secure?: boolean;
  /**
   * a boolean indicating whether the cookie is only to be sent over HTTP(S),
   * and not made available to client JavaScript (true by default).
   */
  httpOnly?: boolean;
  /**
   * a boolean or string indicating whether the cookie is a "same site" cookie (false by default).
   * This can be set to 'strict', 'lax', or true (which maps to 'strict').
   */
  sameSite?: 'strict' | 'lax' | 'none';
}

export interface CookieJar {
  [key: string]: CookieData;
}
interface CookiesOptions {
  keys: string[];
  // Ignored. Only for type-compatibility with the node package for now.
  secure: boolean;
}
export class Cookies {
  static parseCookies(hdrs: string[]): CookieJar {
    const entries = hdrs
      .filter((hdr) => hdr.trim().length > 0)
      .map((cookieDef) => {
        const [keyval, ...opts] = cookieDef.split(';');
        const [name, value] = splitN(keyval, '=', 2).map((value) =>
          value.trim(),
        );
        return [
          name,
          {
            name,
            value,
            ...Object.fromEntries(
              opts.map((opt) =>
                splitN(opt, '=', 2).map((value) => value.trim()),
              ),
            ),
          },
        ];
      });
    const jar = Object.fromEntries(entries) as CookieJar;
    for (const cookie of Object.values(jar)) {
      if (typeof cookie.expires === 'string') {
        cookie.expires = new Date(cookie.expires);
      }
    }
    return jar;
  }

  static encodeCookie(data: CookieData): string {
    let result = '';
    result += `${data.name}=${data.value};`;
    result += Object.entries(data)
      .filter(([key]) => !['name', 'value', 'expires'].includes(key))
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
    if (data.expires) {
      result += ';';
      result += `expires=${data.expires.toUTCString()}`;
    }
    return result;
  }

  receivedCookieJar: CookieJar = {};
  outgoingCookieJar: CookieJar = {};
  private keys: string[] = [];

  constructor(
    req: Request,
    public response: Response,
    {keys = []}: Partial<CookiesOptions> = {},
  ) {
    if (keys) this.keys = keys;

    const cookieReqHdr = getHeader(req.headers, 'Cookie') ?? '';
    this.receivedCookieJar = Cookies.parseCookies(cookieReqHdr.split(','));
    const cookieResHdr = getHeaders(response.headers, 'Set-Cookie') ?? [];
    this.outgoingCookieJar = Cookies.parseCookies(cookieResHdr);
  }

  toHeaders(): string[] {
    return Object.values(this.outgoingCookieJar).map((cookie) =>
      Cookies.encodeCookie(cookie),
    );
  }

  updateHeader() {
    if (!this.response.headers) {
      this.response.headers = {};
    }
    removeHeader(this.response.headers, 'Set-Cookie');
    this.toHeaders().map((hdr) =>
      addHeader(this.response.headers!, 'Set-Cookie', hdr),
    );
  }

  get(name: string): string | undefined {
    return this.receivedCookieJar[name]?.value;
  }

  deleteCookie(name: string) {
    this.set(name, '', {
      path: '/',
      expires: new Date(0),
    });
  }

  async getAndVerify(name: string): Promise<string | undefined> {
    const value = this.get(name);
    if (!value) return undefined;
    if (!(await this.isSignedCookieValid(name))) {
      return undefined;
    }
    return value;
  }

  private get canSign() {
    return this.keys?.length > 0;
  }

  set(name: string, value: string, opts: Partial<CookieData> = {}): void {
    this.outgoingCookieJar[name] = {
      ...opts,
      name,
      value,
    };
    this.updateHeader();
  }

  async setAndSign(
    name: string,
    value: string,
    opts: Partial<CookieData> = {},
  ): Promise<void> {
    if (!this.canSign) {
      throw Error('No keys provided for signing.');
    }
    this.set(name, value, opts);
    const sigName = `${name}.sig`;
    const signature = await createSHA256HMAC(this.keys[0], value);
    this.set(sigName, signature, opts);
    this.updateHeader();
  }

  async isSignedCookieValid(cookieName: string): Promise<boolean> {
    const signedCookieName = `${cookieName}.sig`;
    // No cookie or no signature cookie makes the cookie it invalid.
    if (!this.get(cookieName) || !this.get(signedCookieName)) {
      this.deleteCookie(signedCookieName);
      this.deleteCookie(cookieName);
      return false;
    }

    const value = this.get(cookieName)!;
    const signature = this.get(signedCookieName)!;
    const allCheckSignatures = await Promise.all(
      this.keys.map((key) => createSHA256HMAC(key, value)),
    );
    if (!allCheckSignatures.includes(signature)) {
      this.deleteCookie(signedCookieName);
      this.deleteCookie(cookieName);
      return false;
    }
    return true;
  }
}

function splitN(str: string, sep: string, maxNumParts: number): string[] {
  const parts = str.split(sep);
  return [
    ...parts.slice(0, maxNumParts - 1),
    parts.slice(maxNumParts - 1).join(sep),
  ];
}

/*
  Turns a Headers object into a array of tuples
  [
    ["Set-Cookie", "a=b"],
    ["Set-Cookie", "x=y"],
    // ...
  ]
*/
export function flatHeaders(headers: Headers): string[][] {
  return Object.entries(headers).flatMap(([header, values]) =>
    Array.isArray(values)
      ? values.map((value) => [header, value])
      : [[header, values]],
  );
}

export async function createSHA256HMAC(
  secret: string,
  payload: string,
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    {
      name: 'HMAC',
      hash: {name: 'SHA-256'},
    },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
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
  const hash = await crypto.subtle.digest({name: 'SHA-256'}, buffer);
  return asHex(hash);
}
