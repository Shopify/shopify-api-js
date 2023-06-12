// import type {Headers} from "./headers";
import {createSHA256HMAC} from '../crypto/utils';

import {splitN} from './utils';
import {getHeader, getHeaders, removeHeader, addHeader} from './headers';

import type {NormalizedRequest, NormalizedResponse} from '.';

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
    request: NormalizedRequest,
    public response: NormalizedResponse,
    {keys = []}: Partial<CookiesOptions> = {},
  ) {
    if (keys) this.keys = keys;

    const cookieReqHdr = getHeader(request.headers, 'Cookie') ?? '';
    this.receivedCookieJar = Cookies.parseCookies(cookieReqHdr.split(';'));
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
