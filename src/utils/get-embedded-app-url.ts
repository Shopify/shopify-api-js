import http from 'http';

import * as ShopifyErrors from '../error';
import {Context} from '../context';

import {sanitizeHost} from './shop-validator';

/**
 * Helper method to get the host URL for the app.
 *
 * @param request Current HTTP request
 */
export default function getEmbeddedAppUrl(
  request: http.IncomingMessage,
): string {
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

  return buildEmbeddedAppUrl(host);
}

export function buildEmbeddedAppUrl(host: string): string {
  sanitizeHost(host, true);

  const decodedHost = Buffer.from(host, 'base64').toString();

  return `https://${decodedHost}/apps/${Context.API_KEY}`;
}
