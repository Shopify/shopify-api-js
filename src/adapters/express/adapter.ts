import {
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import {canonicalizeHeaders, Request, Response} from '../../runtime/http';

export async function convertRequest(req: ExpressRequest): Promise<Request> {
  return {
    headers: canonicalizeHeaders(req.headers as any),
    method: req.method,
    url: req.url,
    body: req.body,
  };
}

async function convertResponse(
  response: ExpressResponse,
  internalResponse: Response,
): Promise<void> {
  response.statusCode = internalResponse.statusCode;
  response.statusMessage = internalResponse.statusText;
  Object.entries(internalResponse.headers || {}).forEach(([header, value]) => {
    response.set(header, value);
  });

  if (internalResponse.extra) {
    response.locals.shopify = internalResponse.extra;
  }

  if (!internalResponse.continue) {
    response.end(internalResponse.body);
  }
}

type ExpressCallbackFunc = (
  request: ExpressRequest,
  response: ExpressResponse,
  next: NextFunction,
) => Promise<void>;

export function expressShopifyMiddleware(f: any): ExpressCallbackFunc {
  return async (request, response, next) => {
    const internalResponse: Response = await f(request, response, next);
    convertResponse(response, internalResponse);

    if (internalResponse.continue) {
      next();
    }
  };
}

export {abstractFetch} from '../node/adapter';
