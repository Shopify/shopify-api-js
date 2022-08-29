import http from 'http';

import * as ShopifyErrors from '../error';
import {ConfigInterface} from '../base-types';

import {sanitizeHost} from './shop-validator';

export function createGetEmbeddedAppUrl(config: ConfigInterface) {
  return async (request: http.IncomingMessage): string => {
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

    return createBuildEmbeddedAppUrl(config)(host);
  };
}

export function createBuildEmbeddedAppUrl(config: ConfigInterface) {
  return (host: string): string => {
    sanitizeHost(host, true);

    const decodedHost = Buffer.from(host, 'base64').toString();

    return `https://${decodedHost}/apps/${config.apiKey}`;
  };
}
