import * as ShopifyErrors from '../error';
import {ConfigInterface} from '../base-types';
import {abstractConvertRequest} from '../../runtime/http';
import {sanitizeHost} from '../utils/shop-validator';

import {GetEmbeddedAppUrlParams} from './types';

export function getEmbeddedAppUrl(config: ConfigInterface) {
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

export function buildEmbeddedAppUrl(config: ConfigInterface) {
  return (host: string): string => {
    sanitizeHost(config)(host, true);

    // eslint-disable-next-line no-warning-comments
    // TODO Remove the Buffer.from call when dropping Node 14 support
    const decodedHost =
      typeof atob === 'undefined'
        ? Buffer.from(host, 'base64').toString()
        : atob(host);

    return `https://${decodedHost}/apps/${config.apiKey}`;
  };
}
