import crypto from 'crypto';
import querystring from 'querystring';
import { AuthQueryObject } from '../auth/types';
import safeCompare from './safe-compare';
import { InvalidHmacError } from '../error';

function stringifyQuery(query: AuthQueryObject): string {
  const orderedObj = Object.keys(query)
    .sort((val1, val2) => val1.localeCompare(val2))
    .reduce((a, k) => {
      a[k] = query[k];
      return a;
    }, {});
  return querystring.stringify(orderedObj);
}

function generateLocalHmac(query: AuthQueryObject): string {
  const queryString = stringifyQuery(query);
  return crypto
    .createHmac('sha256', 'some API secret') // TO DO: Refactor to pull secret from context
    .update(queryString)
    .digest('hex');
}

export default function validateHmac(query: AuthQueryObject): boolean {
  if (!query.hmac) {
    throw new InvalidHmacError('Query does not contain an HMAC value.');
  }
  const { hmac, ...rest } = query;
  const localHmac = generateLocalHmac(rest);

  return safeCompare(hmac as string, localHmac);
}
