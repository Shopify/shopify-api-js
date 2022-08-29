import crypto from 'crypto';
import querystring from 'querystring';

import {AuthQuery} from '../auth/oauth/types';
import * as ShopifyErrors from '../error';

import {safeCompare} from './safe-compare';

export function stringifyQuery(query: AuthQuery): string {
  const orderedObj = Object.keys(query)
    .sort((val1, val2) => val1.localeCompare(val2))
    .reduce(
      (obj: {[key: string]: string | undefined}, key: keyof AuthQuery) => ({
        ...obj,
        [key]: query[key],
      }),
      {},
    );
  return querystring.stringify(orderedObj);
}

export function generateLocalHmac(
  apiSecretKey: string,
  {code, timestamp, state, shop, host}: AuthQuery,
): string {
  const queryString = stringifyQuery({
    code,
    timestamp,
    state,
    shop,
    ...(host && {host}),
  });
  return crypto
    .createHmac('sha256', apiSecretKey)
    .update(queryString)
    .digest('hex');
}

export function validateHmac(apiSecretKey: string, query: AuthQuery): boolean {
  if (!query.hmac) {
    throw new ShopifyErrors.InvalidHmacError(
      'Query does not contain an HMAC value.',
    );
  }
  const {hmac} = query;
  const localHmac = generateLocalHmac(apiSecretKey, query);

  return safeCompare(hmac as string, localHmac);
}
