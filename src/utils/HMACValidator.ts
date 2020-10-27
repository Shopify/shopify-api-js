import crypto from 'crypto';
import querystring, { ParsedUrlQuery } from 'querystring';
import { AuthQueryObject } from '../auth/types';
import safeCompare from './safeCompare';

export default class ShopifyHMACValidator {
  query: ParsedUrlQuery | AuthQueryObject;
  queryHmac: string | string[] | undefined;
  localHmac: string | undefined;

  constructor(query: AuthQueryObject | string) {
    this.query = typeof query === 'string' ? querystring.parse(query) : query;
  }

  private removeHmacFromQuery(): void {
    let { hmac, ...rest } = this.query;
    this.queryHmac = hmac;
    this.query = rest;
  }

  private generateLocalHmac(): void {
    let queryString = this.stringifyQuery();
    this.localHmac = crypto
      .createHmac('sha256', 'some API secret')
      .update(queryString)
      .digest('hex');
  }

  private stringifyQuery(): string {
    const orderedObj = Object.keys(this.query)
      .sort((val1, val2) => val1.localeCompare(val2))
      .reduce((a, k) => {
        a[k] = this.query[k];
        return a;
      }, {});
    return querystring.stringify(orderedObj);
  }

  validate(): boolean {
    this.removeHmacFromQuery();
    this.generateLocalHmac();
    return safeCompare(this.queryHmac!, this.localHmac!);
  }
}
