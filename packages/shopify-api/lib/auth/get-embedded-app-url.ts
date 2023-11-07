import * as ShopifyErrors from '../error';
import {ConfigInterface} from '../base-types';
import {abstractConvertRequest} from '../../runtime/http';
import {sanitizeHost} from '../utils/shop-validator';

import {decodeHost} from './decode-host';
import {GetEmbeddedAppUrlParams} from './types';

export type GetEmbeddedAppUrl = (
  params: GetEmbeddedAppUrlParams,
) => Promise<string>;

export type BuildEmbeddedAppUrl = (host: string) => string;

export function getEmbeddedAppUrl(config: ConfigInterface): GetEmbeddedAppUrl {
  return async ({...adapterArgs}: GetEmbeddedAppUrlParams): Promise<string> => {
    const request = await abstractConvertRequest(adapterArgs);

    if (!request) {
      throw new ShopifyErrors.MissingRequiredArgument(
        'getEmbeddedAppUrl requires a request object argument',
      );
    }

    if (!request.url) {
      throw new ShopifyErrors.InvalidRequestError(
        'Request does not contain a URL',
      );
    }

    const url = new URL(request.url, `https://${request.headers.host}`);
    const host = url.searchParams.get('host');

    if (typeof host !== 'string') {
      throw new ShopifyErrors.InvalidRequestError(
        'Request does not contain a host query parameter',
      );
    }

    return buildEmbeddedAppUrl(config)(host);
  };
}

export function buildEmbeddedAppUrl(
  config: ConfigInterface,
): BuildEmbeddedAppUrl {
  return (host: string): string => {
    sanitizeHost()(host, true);
    const decodedHost = decodeHost(host);

    return `https://${decodedHost}/apps/${config.apiKey}`;
  };
}
