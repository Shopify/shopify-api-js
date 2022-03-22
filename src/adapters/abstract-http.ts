// import { createSHA256HMAC } from "../utils/hmac";

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

export function canonicalizeHeaders(hdr: Headers): Headers {
  for (const [key, values] of Object.entries(hdr)) {
    const canonKey = canonicalizeHeaderName(key);
    if (!hdr[canonKey]) hdr[canonKey] = [];
    if (!Array.isArray(hdr[canonKey])) hdr[canonKey] = [hdr[canonKey] as any];
    if (key === canonKey) continue;
    delete hdr[key];
    (hdr[canonKey] as any).push(...[values].flat());
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
  // FIXME: Signing
  // Ignored for now
  signed?: boolean;
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

  private receivedJar: CookieJar = {};
  private newCookieJar: CookieJar = {};
  private keys: string[] = [];

  // TODO: Signing & credential rotation
  constructor(
    req: Request,
    public response: Response,
    {keys = []}: Partial<CookiesOptions> = {},
  ) {
    if (keys) this.keys = keys;
    console.log(this.keys);

    const cookieReqHdr = getHeader(req.headers, 'Cookie') ?? '';
    this.receivedJar = Cookies.parseCookies(cookieReqHdr.split(','));
    const cookieResHdr = getHeaders(response.headers, 'Set-Cookie') ?? [];
    this.newCookieJar = Cookies.parseCookies(cookieResHdr);
  }

  toHeaders(): string[] {
    return Object.values(this.newCookieJar).map((cookie) =>
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

  get(
    name: string,
    _opts: Partial<{signed: boolean}> = {},
  ): string | undefined {
    return this.receivedJar[name]?.value;
  }

  async set(
    name: string,
    value: string,
    opts: Partial<CookieData> = {},
  ): Promise<void> {
    this.newCookieJar[name] = {
      ...opts,
      name,
      value,
    };
    // if(opts.signed) {
    //   const sigName = `${name}.sig`;
    //   this.newCookieJar[sigName] = {
    //     ...opts,
    //     name: sigName,
    //     value: await createSHA256HMAC(this.keys[0], value)
    //   }
    // }
    this.updateHeader();
  }

  // async verifySignedCookies() {
  //   for(const [signedCookieName, signature] of Object.entries(this.receivedJar)) {
  //     if(!signedCookieName.endsWith(".sig")) continue;
  //     const cookieName = signedCookieName.slice(0, ".sig".length * -1);
  //     if(!this.get(cookieName)) {
  //       this.deleteCookie(signedCookieName);
  //       continue;
  //     }
  //     const value = this.get(cookieName);
  //     const allSignatures = await Promise.all(this.keys.map(key => createSHA256HMAC(key, value)));
  //     if(allSignatures.includes(signatures)) {
  //       this.deleteCookie(signedCookieName);
  //       continue;
  //     }
  //   }
  // }
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
