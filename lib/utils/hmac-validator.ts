import {ConfigInterface} from '../base-types';
import {createSHA256HMAC} from '../../runtime/crypto';
import {HashFormat} from '../../runtime/crypto/types';
import {AuthQuery} from '../auth/oauth/types';
import * as ShopifyErrors from '../error';
import {safeCompare} from '../auth/oauth/safe-compare';

import ProcessedQuery from './processed-query';

const HMAC_TIMESTAMP_PERMITTED_CLOCK_TOLERANCE_SEC = 90;

function stringifyQuery(query: AuthQuery): string {
  const processedQuery = new ProcessedQuery();
  Object.keys(query)
    .sort((val1, val2) => val1.localeCompare(val2))
    .forEach((key: string) => processedQuery.put(key, query[key]));

  return processedQuery.stringify(true);
}

export function generateLocalHmac(config: ConfigInterface) {
  return async (params: AuthQuery): Promise<string> => {
    // assumes that 'signature' (from Shopify) will only ever be a hmac value
    const {hmac, signature, ...query} = params;
    const queryString = stringifyQuery(query);
    return createSHA256HMAC(config.apiSecretKey, queryString, HashFormat.Hex);
  };
}

export function validateHmac(config: ConfigInterface) {
  return async (query: AuthQuery): Promise<boolean> => {
    if (!query.hmac && !query.signature) {
      throw new ShopifyErrors.InvalidHmacError(
        'Query does not contain an HMAC value.',
      );
    }

    validateHmacTimestamp(query);

    const hmac = query.signature || query.hmac;
    const localHmac = await generateLocalHmac(config)(query);

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
