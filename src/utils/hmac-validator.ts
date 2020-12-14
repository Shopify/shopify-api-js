import crypto from 'crypto';
import querystring from 'querystring';
import { AuthQuery } from '../auth/types';
import safeCompare from './safe-compare';
import * as ShopifyErrors from '../error';
import { Context } from '../context';

export function stringifyQuery(query: AuthQuery): string {
  const orderedObj = Object.keys(query)
    .sort((val1, val2) => val1.localeCompare(val2))
    .reduce((a: { [key: string]: string | undefined }, k: keyof AuthQuery) => {
      a[k] = query[k];
      return a;
    }, {});
  return querystring.stringify(orderedObj);
}

export function generateLocalHmac(query: AuthQuery): string {
  const queryString = stringifyQuery(query);
  return crypto
    .createHmac('sha256', Context.API_SECRET_KEY)
    .update(queryString)
    .digest('hex');
}

/**
 * Uses the received query to validate the contained hmac value against the rest of the query content.
 * 
 * @param query Request query object, containing the information to be validated.
 */
export default function validateHmac(query: AuthQuery): boolean {
  if (!query.hmac) {
    throw new ShopifyErrors.InvalidHmacError(
      'Query does not contain an HMAC value.'
    );
  }
  const { hmac, ...rest } = query;
  const localHmac = generateLocalHmac(rest);

  return safeCompare(hmac as string, localHmac);
}
