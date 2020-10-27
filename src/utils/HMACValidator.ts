import crypto from 'crypto';
import querystring, { ParsedUrlQuery } from 'querystring';
import { AuthQueryObject } from '../auth/types';
import safeCompare from './SafeCompare';

export default class ShopifyHMACValidator {
  query: ParsedUrlQuery | AuthQueryObject;
  queryHmac: string;
  localHmac: string;

  constructor(query: AuthQueryObject | string) {
    this.query = typeof query === 'string' ? querystring.parse(query) : query;
  }

  private removeHmacFromQuery(): void {
    const { hmac, ...rest } = this.query;
    this.queryHmac = hmac as string;
    this.query = rest;
  }

  private generateLocalHmac(): void {
    const queryString = this.stringifyQuery();
    this.localHmac = crypto
      .createHmac('sha256', 'some API secret')
      .update(queryString)
      .digest('hex');
  }

  stringifyQuery(): string {
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
    return safeCompare(this.queryHmac, this.localHmac);
  }
}
