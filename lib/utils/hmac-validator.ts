import {ConfigInterface} from '../base-types';
import {createSHA256HMAC} from '../../runtime/crypto';
import {HashFormat} from '../../runtime/crypto/types';
import {AuthQuery} from '../auth/oauth/types';
import * as ShopifyErrors from '../error';
import {safeCompare} from '../auth/oauth/safe-compare';

import ProcessedQuery from './processed-query';

const HMAC_TIMESTAMP_PERMITTED_CLOCK_TOLERANCE_MS = 10000;

function stringifyQuery(query: AuthQuery): string {
  const processedQuery = new ProcessedQuery();
  Object.keys(query)
    .sort((val1, val2) => val1.localeCompare(val2))
    .forEach((key: string) => processedQuery.put(key, query[key]));

  return processedQuery.stringify(true);
}

export function generateLocalHmac(config: ConfigInterface) {
  return async (params: AuthQuery): Promise<string> => {
    const {hmac, ...query} = params;
    const queryString = stringifyQuery(query);
    return createSHA256HMAC(config.apiSecretKey, queryString, HashFormat.Hex);
  };
}

export function validateHmac(config: ConfigInterface) {
  return async (query: AuthQuery): Promise<boolean> => {
    if (!query.hmac) {
      throw new ShopifyErrors.InvalidHmacError(
        'Query does not contain an HMAC value.',
      );
    }

    validateHmacTimestamp(query);

    const {hmac} = query;
    const localHmac = await generateLocalHmac(config)(query);

    return safeCompare(hmac as string, localHmac);
  };
}

function validateHmacTimestamp(query: AuthQuery) {
  if (
    Date.now() - Number(query.timestamp) >
    HMAC_TIMESTAMP_PERMITTED_CLOCK_TOLERANCE_MS
  ) {
    throw new ShopifyErrors.InvalidHmacError(
      'HMAC timestamp is outside of the tolerance range',
    );
  }
}
