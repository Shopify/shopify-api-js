export interface Headers {
  [key: string]: string;
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

export function isOK(resp: Response) {
  // https://fetch.spec.whatwg.org/#ok-status
  return resp.statusCode >= 200 && resp.statusCode <= 299;
}

export function getHeaders(
  headers: Headers | undefined,
  needle_: string,
): string[] | undefined {
  if (!headers) return;
  const needle = needle_.toLowerCase();
  return Object.entries(headers)
    .filter(([key]) => key.toLowerCase() === needle)
    .map(([_key, value]) => value);
}

export function getHeader(
  headers: Headers | undefined,
  needle: string,
): string | undefined {
  if (!headers) return;
  return getHeaders(headers, needle)?.[0];
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
export class Cookies {
  static parseCookies(hdrs: string[]): CookieJar {
    const entries = hdrs.map((cookieDef) => {
      const [keyval, ...opts] = cookieDef.split(';');
      const [name, value] = splitN(keyval, '=', 2).map((value) => value.trim());
      return [
        name,
        {
          name,
          value,
          ...Object.fromEntries(
            opts.map((opt) => splitN(opt, '=', 2).map((value) => value.trim())),
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

  // TODO: Signing & credential rotation
  constructor(req: Request, public response: Response, _opts: any) {
    const cookieReqHdr = getHeader(req.headers, 'Cookie') ?? '';
    this.receivedJar = Cookies.parseCookies(cookieReqHdr.split(','));
    const cookieResHdr = getHeaders(response.headers, 'Set-Cookie') ?? [];
    this.newCookieJar = Cookies.parseCookies(cookieResHdr);
  }

  toHeader(): string {
    return Object.values(this.newCookieJar)
      .map((cookie) => Cookies.encodeCookie(cookie))
      .join(',');
  }

  updateHeader() {
    if (!this.response.headers) {
      this.response.headers = {};
    }
    this.response.headers['Set-Cookie'] = this.toHeader();
  }

  // FIXME: Signing
  get(
    name: string,
    _opts: Partial<{signed: boolean}> = {},
  ): string | undefined {
    const oldCookie = this.receivedJar[name]?.value;
    if (oldCookie) return oldCookie;
    return this.newCookieJar[name]?.value;
  }

  set(name: string, value: string, opts: Partial<CookieData>) {
    this.newCookieJar[name] = {
      ...opts,
      name,
      value,
    };
    this.updateHeader();
  }
}

function splitN(str: string, sep: string, maxNumParts: number): string[] {
  const parts = str.split(sep);
  return [
    ...parts.slice(0, maxNumParts - 1),
    parts.slice(maxNumParts - 1).join(sep),
  ];
}
