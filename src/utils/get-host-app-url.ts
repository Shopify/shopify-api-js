import http from 'http';
import url from 'url';

import * as ShopifyErrors from '../error';
import {Context} from '../context';

/**
 * Helper method to get the host URL for the app.
 *
 * @param request Current HTTP request
 */
export default function getHostAppUrl(request: http.IncomingMessage): string {
  if (!request) {
    throw new ShopifyErrors.MissingRequiredArgument(
      'getHostAppUrl requires a request object argument',
    );
  }

  if (!request.url) {
    throw new ShopifyErrors.InvalidRequestError(
      'Request does not contain a URL',
    );
  }

  const query = url.parse(request.url, true).query;

  if (typeof query.host !== 'string') {
    throw new ShopifyErrors.InvalidRequestError(
      'Request does not contain a host query parameter',
    );
  }

  const host = Buffer.from(query.host, 'base64').toString();

  return `https://${host}/apps/${Context.API_KEY}`;
}
