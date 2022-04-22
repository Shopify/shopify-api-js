// import type {Headers} from "./headers";
import {splitN} from '../../utils/spitn';
import {createSHA256HMAC} from '../crypto/utils';

import {getHeaders} from './headers';

import type {Request} from '.';

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
export class IncomingCookieJar {
  static fromRequest(req: Request, keys: string[] = []): IncomingCookieJar {
    const hdrs = getHeaders(req.headers, "Cookie");
    return new IncomingCookieJar(hdrs, keys);
  }

  private static parseHeaders(hdrs: string[]): Record<string, string> {
    const entries = hdrs
      .filter((hdr) => hdr.trim().length > 0)
      .map((cookieDef) => {
        const [keyval] = cookieDef.split(';');
        const [name, value] = splitN(keyval, '=', 2).map((value) =>
          value.trim(),
        );
        return [
          name,
          value,
        ];
      });
      return Object.fromEntries(entries);
  }

  private jar: Record<string, string> = {};
  private keys: string[] = [];

  constructor(
    hdrs: string[],
    keys:  string[]  = []
  ) {
    if (keys) this.keys = keys;

    this.jar = IncomingCookieJar.parseHeaders(hdrs);
  }

  get(name: string): string | undefined {
    return this.jar[name];
  }

  entries() {
    return Object.entries(this.jar);
  }

  async getAndVerify(name: string): Promise<string | undefined> {
    const value = this.get(name);
    if (!value) return undefined;
    if (!(await this.isSignedCookieValid(name))) {
      return undefined;
    }
    return value;
  }

  async isSignedCookieValid(cookieName: string): Promise<boolean> {
    const signedCookieName = `${cookieName}.sig`;
    // No cookie or no signature cookie makes the cookie it invalid.
    if (!this.get(cookieName) || !this.get(signedCookieName)) {
      return false;
    }

    const value = this.get(cookieName)!;
    const signature = this.get(signedCookieName)!;
    const allCheckSignatures = await Promise.all(
      this.keys.map((key) => createSHA256HMAC(key, value)),
    );
    if (!allCheckSignatures.includes(signature)) {
      return false;
    }
    return true;
  }
}
export class OutgoingCookieJar {
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

  private jar: Record<string, CookieData> = {};
  private keys: string[] = [];

  constructor(
    keys:  string[]  = []
  ) {
    if (keys) this.keys = keys;

    this.jar = {};
  }

  toHeaders(): string[] {
    return Object.values(this.jar).map((cookie) =>
      OutgoingCookieJar.encodeCookie(cookie),
    );
  }

  deleteCookie(name: string) {
    this.set(name, '', {
      path: '/',
      expires: new Date(0),
    });
  }

  private get canSign() {
    return this.keys?.length > 0;
  }

  set(name: string, value: string, opts: Partial<CookieData> = {}): void {
    this.jar[name] = {
      ...opts,
      name,
      value,
    };
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
  }


}
