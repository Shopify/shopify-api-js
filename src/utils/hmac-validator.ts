<<<<<<< HEAD
import crypto from 'crypto';
import querystring from 'querystring';

import {AuthQuery} from '../auth/types';
=======
import {Context} from '../context';
import {AuthQuery} from '../auth/oauth/types';
>>>>>>> origin/isomorphic/main
import * as ShopifyErrors from '../error';
import {createSHA256HMAC} from '../runtime/crypto';

import safeCompare from './safe-compare';

export function stringifyQuery(query: AuthQuery): string {
<<<<<<< HEAD
  const orderedObj = Object.keys(query)
    .sort((val1, val2) => val1.localeCompare(val2))
    .reduce((a: { [key: string]: string | undefined; }, k: keyof AuthQuery) => {
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
=======
  const orderedObj = Object.fromEntries(
    Object.entries(query).sort((val1, val2) => val1[0].localeCompare(val2[0])),
  );
  return new URLSearchParams(orderedObj).toString();
}

export async function generateLocalHmac({
  code,
  timestamp,
  state,
  shop,
  host,
}: AuthQuery): Promise<string> {
  const queryString = stringifyQuery({
    code,
    timestamp,
    state,
    shop,
    ...(host && {host}),
  });
  return createSHA256HMAC(Context.API_SECRET_KEY, queryString);
>>>>>>> origin/isomorphic/main
}

/**
 * Uses the received query to validate the contained hmac value against the rest of the query content.
 *
 * @param query HTTP Request Query, containing the information to be validated.
 */
export default async function validateHmac(query: AuthQuery): Promise<boolean> {
  if (!query.hmac) {
    throw new ShopifyErrors.InvalidHmacError(
      'Query does not contain an HMAC value.',
    );
  }
<<<<<<< HEAD
  const {hmac, ...rest} = query;
  const localHmac = generateLocalHmac(rest);
=======
  const {hmac} = query;
  const localHmac = await generateLocalHmac(query);
>>>>>>> origin/isomorphic/main

  return safeCompare(hmac as string, localHmac);
}
