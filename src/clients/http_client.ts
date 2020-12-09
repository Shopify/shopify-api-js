import fetch, { RequestInit, Response, Headers } from 'node-fetch';
import querystring, { ParsedUrlQueryInput } from 'querystring';
import { Method, StatusCode } from '@shopify/network';
import ShopifyErrors from '../error';
import { SHOPIFY_APP_DEV_KIT_VERSION } from '../version';
import { validateShop } from '../utils';

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
  query?: Record<string, string | number>,
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

type RequestReturn = {
  body: unknown,
  headers: Headers,
};

class HttpClient {
  static readonly RETRY_WAIT_TIME = 1000; // 1 second

  public constructor(private domain: string) {
    if (!validateShop(domain)) {
      throw new ShopifyErrors.InvalidShopError(`Domain ${domain} is not valid`);
    }

    this.domain = domain;
  }

  /**
   * Performs a GET request on the given path.
   */
  public async get(params: GetRequestParams): Promise<RequestReturn> {
    return this.request({ method: Method.Get, ...params });
  }

  /**
   * Performs a POST request on the given path.
   */
  public async post(params: PostRequestParams): Promise<RequestReturn> {
    return this.request({ method: Method.Post, ...params });
  }

  /**
   * Performs a PUT request on the given path.
   */
  public async put(params: PutRequestParams): Promise<RequestReturn> {
    return this.request({ method: Method.Put, ...params });
  }

  /**
   * Performs a DELETE request on the given path.
   */
  public async delete(params: DeleteRequestParams): Promise<RequestReturn> {
    return this.request({ method: Method.Delete, ...params });
  }

  protected async request(params: RequestParams): Promise<RequestReturn> {
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

    const queryString = params.query ? '?' + querystring.stringify(params.query as ParsedUrlQueryInput) : '';

    const url = `https://${this.domain}${params.path}${queryString}`;
    const options: RequestInit = {
      method: params.method.toString(),
      headers: headers,
      body: body
    } as RequestInit;

    let tries = 0;
    while (tries < maxTries) {
      try {
        return await this.doRequest(url, options);
      }
      catch (e) {
        tries++;
        if (e instanceof ShopifyErrors.HttpRetriableError) {
          // We're not out of tries yet, use them
          if (tries < maxTries) {
            let waitTime = HttpClient.RETRY_WAIT_TIME;
            if (e instanceof ShopifyErrors.HttpThrottlingError && e.retryAfter) {
              waitTime = e.retryAfter * 1000;
            }
            await new Promise(r => setTimeout(r, waitTime));
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

    // We're never supposed to come this far, this is here only for the benefit of Typescript
    /* istanbul ignore next */
    throw new ShopifyErrors.ShopifyError(`Unexpected flow, reached maximum HTTP tries but did not throw an error`);
  }

  private async doRequest(url: string, options: RequestInit): Promise<RequestReturn> {
    return fetch(url, options)
      .then(async (response: Response) => {
        const body = await response.json();

        if (response.ok) {
          return {
            body: body,
            headers: response.headers,
          };
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
            case response.status === StatusCode.TooManyRequests: {
              const retryAfter = response.headers.get('Retry-After');
              throw new ShopifyErrors.HttpThrottlingError(
                `Shopify is throttling requests${errorMessage}`,
                retryAfter ? parseFloat(retryAfter) : undefined
              );
            }
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
}

export {
  HttpClient,
  HeaderParams,
  GetRequestParams,
  PostRequestParams,
  PutRequestParams,
  DeleteRequestParams,
  RequestParams,
  DataType,
  RequestReturn,
};
