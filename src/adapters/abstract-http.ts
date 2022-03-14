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

export function getHeader(
  headers: Headers | undefined,
  needle_: string,
): string | undefined {
  if (!headers) return;
  const needle = needle_.toLowerCase();
  return Object.entries(headers).find(
    ([key]) => key.toLowerCase() === needle,
  )?.[1];
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

export type CookieJar = Record<string, CookieData>;
export class Cookies {
  private receivedJar: CookieJar = {};
  private newCookieJar: CookieJar = {};
  // TODO: Signing & credential rotation
  constructor(req: Request, public response: Response, _opts: any) {
    const cookieReqHdr = getHeader(req.headers, 'Cookie') ?? '';
    this.receivedJar = Cookies.parseHeader(cookieReqHdr);
    const cookieResHdr = getHeader(response.headers, 'Set-Cookie') ?? '';
    this.newCookieJar = Cookies.parseHeader(cookieResHdr);
  }

  static parseHeader(hdr: string): CookieJar {
    const entries = hdr.split(",").filter(h => h.trim().length > 0).map(cookieDef =>{
      const [keyval, ...opts] = cookieDef.split(";");
      const [name, value] = splitN(keyval, "=", 2).map(v => v.trim());
      return [
        name,
        {
          name,
          value,
          ...Object.fromEntries(opts.map(opt => splitN(opt, "=", 2).map(v => v.trim()))),
        }
      ]
    });
    return Object.fromEntries(entries);
  }

  toHeader(): string {
    let header = "";
    for(const [name, data] of Object.entries(this.newCookieJar)) {
      header += `${name}=${data.value};`;
      header += Object.entries(data).filter(([key]) => !["name", "value"].includes(key)).map(([key, value]) => `${key}=${value}`).join("; ");
      header += ",";
    }
    return header;
  }

  updateHeader() {
    if(!this.response.headers) {
      this.response.headers = {};
    }
    this.response.headers["Set-Cookie"] = this.toHeader();
  }

  // FIXME: Signing
  get(name: string, _opts: Partial<{signed: boolean}> ={}): string| undefined {
    const oldCookie = this.receivedJar[name]?.value;
    if(oldCookie) return oldCookie;
    return this.newCookieJar[name]?.value;
  }

  set(name: string, value: string, opts: Partial<CookieData>) {
    this.newCookieJar[name] = {
      ...opts,
      name,
      value
    };
    this.updateHeader();
  }
}

function splitN(v: string, sep: string, n: number): string[] {
  const parts = v.split(sep);
  return [...parts.slice(0, n-1), parts.slice(n-1).join(sep)];
}