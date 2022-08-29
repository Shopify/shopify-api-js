import http from 'http';

import * as ShopifyErrors from '../error';
import {ConfigInterface} from '../base-types';

import {createSanitizeHost} from './shop-validator';

export function createGetEmbeddedAppUrl(config: ConfigInterface) {
  return (request: http.IncomingMessage): string => {
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
    createSanitizeHost(config)(host, true);

    const decodedHost = atob(host);

    return `https://${decodedHost}/apps/${config.apiKey}`;
  };
}
