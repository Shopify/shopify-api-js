import {ConfigInterface} from '../base-types';
import {createSHA256HMAC} from '../../runtime/crypto';
import {HashFormat} from '../../runtime/crypto/types';
import {AuthQuery} from '../auth/oauth/types';
import * as ShopifyErrors from '../error';
import {safeCompare} from '../auth/oauth/safe-compare';

import ProcessedQuery from './processed-query';

const HMAC_TIMESTAMP_PERMITTED_CLOCK_TOLERANCE_SEC = 90;

export type HMACSignator = 'admin' | 'appProxy';

function stringifyQueryForAdmin(query: AuthQuery): string {
  const processedQuery = new ProcessedQuery();
  Object.keys(query)
    .sort((val1, val2) => val1.localeCompare(val2))
    .forEach((key: string) => processedQuery.put(key, query[key]));

  return processedQuery.stringify(true);
}

function stringifyQueryForAppProxy(query: AuthQuery): string {
  return Object.entries(query)
    .sort(([val1], [val2]) => val1.localeCompare(val2))
    .reduce((acc, [key, value]) => {
      return `${acc}${key}=${Array.isArray(value) ? value.join(',') : value}`;
    }, '');
}

export function generateLocalHmac(config: ConfigInterface) {
  return async (
    params: AuthQuery,
    signator: HMACSignator = 'admin',
  ): Promise<string> => {
    const {hmac, signature, ...query} = params;

    const queryString =
      signator === 'admin'
        ? stringifyQueryForAdmin(query)
        : stringifyQueryForAppProxy(query);

    return createSHA256HMAC(config.apiSecretKey, queryString, HashFormat.Hex);
  };
}

export function validateHmac(config: ConfigInterface) {
  return async (
    query: AuthQuery,
    {signator}: {signator: HMACSignator} = {signator: 'admin'},
  ): Promise<boolean> => {
    if (signator === 'admin' && !query.hmac) {
      throw new ShopifyErrors.InvalidHmacError(
        'Query does not contain an HMAC value.',
      );
    }

    if (signator === 'appProxy' && !query.signature) {
      throw new ShopifyErrors.InvalidHmacError(
        'Query does not contain a signature value.',
      );
    }

    validateHmacTimestamp(query);

    const hmac = signator === 'appProxy' ? query.signature : query.hmac;
    const localHmac = await generateLocalHmac(config)(query, signator);

    return safeCompare(hmac as string, localHmac);
  };
}

export function getCurrentTimeInSec() {
  return Math.trunc(Date.now() / 1000);
}

function validateHmacTimestamp(query: AuthQuery) {
  if (
    Math.abs(getCurrentTimeInSec() - Number(query.timestamp)) >
    HMAC_TIMESTAMP_PERMITTED_CLOCK_TOLERANCE_SEC
  ) {
    throw new ShopifyErrors.InvalidHmacError(
      'HMAC timestamp is outside of the tolerance range',
    );
  }
}
