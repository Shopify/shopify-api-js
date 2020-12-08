import fetch, { RequestInit, Response } from 'node-fetch';
import querystring, { ParsedUrlQueryInput } from 'querystring';
import { Method, StatusCode } from '@shopify/network';
import ShopifyErrors from '../error';
import { SHOPIFY_APP_DEV_KIT_VERSION } from '../version';

type HeaderParams = Record<string, string>;

enum DataType {
  JSON = "application/json",
  GraphQL = "application/graphql",
  URLEncoded = "application/x-www-form-urlencoded"
}

type GetRequestParams = {
  path: string,
  type?: DataType,
  data?: Record<string, unknown> | string,
  extraHeaders?: HeaderParams,
  tries?: number,
}

type PostRequestParams = GetRequestParams & {
  type: DataType,
  data: Record<string, unknown> | string,
}

type PutRequestParams = PostRequestParams;

type DeleteRequestParams = GetRequestParams;

type RequestParams = (GetRequestParams | PostRequestParams) & { method: Method }

type Constructor<T = {}> = new (...args: any[]) => T;

const RETRY_WAIT_TIME = 1000; // 1 second

async function request(domain: string, params: RequestParams): Promise<unknown> {
  const maxTries = params.tries ? params.tries : 1;
  if (maxTries <= 0) {
    throw new ShopifyErrors.HttpRequestError(`Number of tries must be >= 0, got ${maxTries}`);
  }

  let userAgent = `Shopify App Dev Kit v${SHOPIFY_APP_DEV_KIT_VERSION} | Node ${process.version}`;
  if (params.extraHeaders) {
    if (params.extraHeaders['user-agent']) {
      userAgent = `${params.extraHeaders['user-agent']} | ${userAgent}`;
      delete params.extraHeaders['user-agent'];
    }
    else if (params.extraHeaders['User-Agent']) {
      userAgent = `${params.extraHeaders['User-Agent']} | ${userAgent}`;
    }
  }

  let headers: typeof params.extraHeaders = Object.assign(
    {},
    params.extraHeaders,
    { 'User-Agent': userAgent }
  );
  let body = null;
  if (params.method === Method.Post || params.method === Method.Put) {
    const { type, data } = params as PostRequestParams;
    if (data) {
      switch (type) {
        case DataType.JSON:
          body = typeof data === 'string' ? data : JSON.stringify(data);
          break;
        case DataType.URLEncoded:
          body = typeof data === 'string' ? data : querystring.stringify(data as ParsedUrlQueryInput);
          break;
        case DataType.GraphQL:
          body = data as string;
          break;
      }
      headers = Object.assign(
        {
          'Content-Type': type,
          'Content-Length': Buffer.byteLength(body as string),
        },
        params.extraHeaders,
      );
    }
  }

  const url = `https://${domain}${params.path}`;
  const options: RequestInit = {
    method: params.method.toString(),
    headers: headers,
    body: body
  } as RequestInit;

  let tries = 0;
  while (tries < maxTries) {
    try {
      return await doRequest(url, options);
    }
    catch (e) {
      tries++;
      if (e instanceof ShopifyErrors.HttpRetriableError) {
        // We're not out of tries yet, use them
        if (tries < maxTries) {
          await new Promise(r => setTimeout(r, RETRY_WAIT_TIME));
          continue;
        }

        // We're set to multiple tries but ran out
        if (maxTries > 1) {
          throw new ShopifyErrors.HttpMaxRetriesError(
            `Exceeded maximum retry count of ${maxTries}. Last message: ${e.message}`
          );
        }
      }

      // We're not retrying or the error is not retriable, rethrow
      throw e;
    }
  }
}

async function doRequest(url: string, options: RequestInit): Promise<unknown> {
  return fetch(url, options)
    .then(async (response: Response) => {
      const body = await response.json();

      if (response.ok) {
        return body;
      }
      else {
        const errorMessages: string[] = [];
        if (body.errors) {
          errorMessages.push(body.errors);
        }
        if (response.headers && response.headers.get('x-request-id')) {
          errorMessages.push(
            `If you report this error, please include this id: ${response.headers.get('x-request-id')}`
          );
        }

        const errorMessage = (errorMessages.length) ? ': ' + errorMessages.join('. ') : '';
        switch (true) {
          case response.status === StatusCode.TooManyRequests:
            throw new ShopifyErrors.HttpThrottlingError(
              `Shopify is throttling requests${errorMessage}`
            );
          case response.status >= StatusCode.InternalServerError:
            throw new ShopifyErrors.HttpInternalError(
              `Shopify internal error${errorMessage}`
            );
          default:
            throw new ShopifyErrors.HttpResponseError(
              `Received an error response (${response.status} ${response.statusText}) from Shopify${errorMessage}`,
              response.status,
              response.statusText
            );
        }
      }
    })
    .catch((error) => {
      if (!(error instanceof ShopifyErrors.ShopifyError)) {
        throw new ShopifyErrors.HttpRequestError(`Failed to make Shopify HTTP request: ${error}`);
      }
      else {
        throw error;
      }
    });
  }

function GetRequest<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    public async get(domain: string, params: GetRequestParams): Promise<unknown> {
      return request(domain, { method: Method.Get, ...params });
    }
  }
}

function PostRequest<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    public static async post(domain: string, params: PostRequestParams): Promise<unknown> {
      return request(domain, { method: Method.Post, ...params });
    }
  };
}

function PutRequest<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    public async put(domain: string, params: PutRequestParams): Promise<unknown> {
      return request(domain, { method: Method.Put, ...params });
    }
  }
}

function DeleteRequest<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    public async delete(domain: string, params: DeleteRequestParams): Promise<unknown> {
      return request(domain, { method: Method.Delete, ...params });
    }
  }
}

export {
  HeaderParams,
  GetRequestParams,
  PostRequestParams,
  PutRequestParams,
  DeleteRequestParams,
  DataType,
  GetRequest,
  PostRequest,
  PutRequest,
  DeleteRequest,
};