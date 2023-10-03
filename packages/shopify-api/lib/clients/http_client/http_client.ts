import {Method, StatusCode} from '@shopify/network';

import * as ShopifyErrors from '../../error';
import {LIBRARY_NAME} from '../../types';
import {SHOPIFY_API_LIBRARY_VERSION} from '../../version';
import ProcessedQuery from '../../utils/processed-query';
import {ConfigInterface} from '../../base-types';
import {createSHA256HMAC} from '../../../runtime/crypto';
import {HashFormat} from '../../../runtime/crypto/types';
import {
  abstractFetch,
  canonicalizeHeaders,
  getHeader,
  isOK,
  NormalizedRequest,
  NormalizedResponse,
} from '../../../runtime/http';
import {abstractRuntimeString} from '../../../runtime/platform';
import {logger} from '../../logger';

import {
  DataType,
  DeleteRequestParams,
  GetRequestParams,
  PostRequestParams,
  PutRequestParams,
  RequestParams,
  RequestReturn,
} from './types';

interface DeprecationInterface {
  message: string | null;
  path: string;
  body?: string;
}

interface HttpClientParams {
  domain: string;
}

export class HttpClient {
  public static config: ConfigInterface;
  public static scheme: string;

  // 1 second
  static readonly RETRY_WAIT_TIME = 1000;
  // 5 minutes
  static readonly DEPRECATION_ALERT_DELAY = 300000;
  loggedDeprecations: {[key: string]: number} = {};
  readonly domain: string;

  public constructor(params: HttpClientParams) {
    this.domain = params.domain;
  }

  /**
   * Performs a GET request on the given path.
   */
  public async get<T = unknown>(params: GetRequestParams) {
    return this.request<T>({method: Method.Get, ...params});
  }

  /**
   * Performs a POST request on the given path.
   */
  public async post<T = unknown>(params: PostRequestParams) {
    return this.request<T>({method: Method.Post, ...params});
  }

  /**
   * Performs a PUT request on the given path.
   */
  public async put<T = unknown>(params: PutRequestParams) {
    return this.request<T>({method: Method.Put, ...params});
  }

  /**
   * Performs a DELETE request on the given path.
   */
  public async delete<T = unknown>(params: DeleteRequestParams) {
    return this.request<T>({method: Method.Delete, ...params});
  }

  protected async request<T = unknown>(
    params: RequestParams,
  ): Promise<RequestReturn<T>> {
    const maxTries = params.tries ? params.tries : 1;
    if (maxTries <= 0) {
      throw new ShopifyErrors.HttpRequestError(
        `Number of tries must be >= 0, got ${maxTries}`,
      );
    }

    let userAgent = `${LIBRARY_NAME} v${SHOPIFY_API_LIBRARY_VERSION} | ${abstractRuntimeString()}`;

    if (this.httpClass().config.userAgentPrefix) {
      userAgent = `${this.httpClass().config.userAgentPrefix} | ${userAgent}`;
    }

    if (params.extraHeaders) {
      if (params.extraHeaders['user-agent']) {
        userAgent = `${params.extraHeaders['user-agent']} | ${userAgent}`;
        delete params.extraHeaders['user-agent'];
      } else if (params.extraHeaders['User-Agent']) {
        userAgent = `${params.extraHeaders['User-Agent']} | ${userAgent}`;
      }
    }

    let headers: typeof params.extraHeaders = {
      ...params.extraHeaders,
      'User-Agent': userAgent,
    };
    let body;
    if (params.method === Method.Post || params.method === Method.Put) {
      const type = (params as PostRequestParams).type ?? DataType.JSON;
      const data = (params as PostRequestParams).data;
      if (data) {
        switch (type) {
          case DataType.JSON:
            body = typeof data === 'string' ? data : JSON.stringify(data);
            break;
          case DataType.URLEncoded:
            body =
              typeof data === 'string'
                ? data
                : new URLSearchParams(
                    data as {[key: string]: string},
                  ).toString();
            break;
          case DataType.GraphQL:
            body = data as string;
            break;
        }
        headers = {
          ...headers,
          'Content-Type': type!,
          'Content-Length': new TextEncoder().encode(body).length,
        };
      }
    }

    const url = `${this.httpClass().scheme}://${
      this.domain
    }${this.getRequestPath(params.path)}${ProcessedQuery.stringify(
      params.query,
    )}`;
    const request: NormalizedRequest = {
      method: params.method,
      url,
      headers: canonicalizeHeaders(headers as any),
      body,
    };

    if (this.httpClass().config.logger.httpRequests) {
      const message = [
        'Making HTTP request',
        `${request.method} ${request.url}`,
        `Headers: ${JSON.stringify(headers)}`,
      ];

      if (body) {
        message.push(`Body: ${JSON.stringify(body).replace(/\n/g, '\\n  ')}`);
      }

      logger(this.httpClass().config).debug(message.join('  -  '));
    }

    async function sleep(waitTime: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    let tries = 0;
    while (tries < maxTries) {
      try {
        return await this.doRequest<T>(request);
      } catch (error) {
        tries++;
        if (error instanceof ShopifyErrors.HttpRetriableError) {
          // We're not out of tries yet, use them
          if (tries < maxTries) {
            let waitTime = this.httpClass().RETRY_WAIT_TIME;
            if (
              error instanceof ShopifyErrors.HttpThrottlingError &&
              error.response.retryAfter
            ) {
              waitTime = error.response.retryAfter * 1000;
            }
            await sleep(waitTime);
            continue;
          }

          // We're set to multiple tries but ran out
          if (maxTries > 1) {
            throw new ShopifyErrors.HttpMaxRetriesError(
              `Exceeded maximum retry count of ${maxTries}. Last message: ${error.message}`,
            );
          }
        }

        // We're not retrying or the error is not retriable, rethrow
        throw error;
      }
    }

    // We're never supposed to come this far, this is here only for the benefit of Typescript
    /* istanbul ignore next */
    throw new ShopifyErrors.ShopifyError(
      `Unexpected flow, reached maximum HTTP tries but did not throw an error`,
    );
  }

  protected getRequestPath(path: string): string {
    return `/${path.replace(/^\//, '')}`;
  }

  private httpClass() {
    return this.constructor as typeof HttpClient;
  }

  private throwFailedRequest(body: any, response: NormalizedResponse): never {
    const errorMessages: string[] = [];
    if (body.errors) {
      errorMessages.push(JSON.stringify(body.errors, null, 2));
    }
    const xRequestId = getHeader(response.headers, 'x-request-id');
    if (xRequestId) {
      errorMessages.push(
        `If you report this error, please include this id: ${xRequestId}`,
      );
    }

    const errorMessage = errorMessages.length
      ? `:\n${errorMessages.join('\n')}`
      : '';
    const headers = response.headers ? response.headers : {};
    const code = response.statusCode;
    const statusText = response.statusText;

    switch (true) {
      case response.statusCode === StatusCode.TooManyRequests: {
        const retryAfter = getHeader(response.headers, 'Retry-After');
        throw new ShopifyErrors.HttpThrottlingError({
          message: `Shopify is throttling requests${errorMessage}`,
          code,
          statusText,
          body,
          headers,
          retryAfter: retryAfter ? parseFloat(retryAfter) : undefined,
        });
      }
      case response.statusCode >= StatusCode.InternalServerError:
        throw new ShopifyErrors.HttpInternalError({
          message: `Shopify internal error${errorMessage}`,
          code,
          statusText,
          body,
          headers,
        });
      default:
        throw new ShopifyErrors.HttpResponseError({
          message: `Received an error response (${response.statusCode} ${response.statusText}) from Shopify${errorMessage}`,
          code,
          statusText,
          body,
          headers,
        });
    }
  }

  private async doRequest<T = unknown>(
    request: NormalizedRequest,
  ): Promise<RequestReturn<T>> {
    const log = logger(this.httpClass().config);

    const response: NormalizedResponse = await abstractFetch(request);

    if (this.httpClass().config.logger.httpRequests) {
      log.debug(
        `Completed HTTP request, received ${response.statusCode} ${response.statusText}`,
      );
    }

    let body: {[key: string]: string} | string | T = {};

    if (response.body) {
      try {
        body = JSON.parse(response.body);
      } catch (error) {
        body = response.body;
      }
    }

    if (!isOK(response)) {
      this.throwFailedRequest(body, response);
    }

    const deprecationReason = getHeader(
      response.headers,
      'X-Shopify-API-Deprecated-Reason',
    );
    if (deprecationReason) {
      const deprecation: DeprecationInterface = {
        message: deprecationReason,
        path: request.url,
      };

      if (request.body) {
        // This can only be a string, since we're always converting the body before calling this method
        deprecation.body = `${(request.body as string).substring(0, 100)}...`;
      }

      const depHash = await createSHA256HMAC(
        this.httpClass().config.apiSecretKey,
        JSON.stringify(deprecation),
        HashFormat.Hex,
      );

      if (
        !Object.keys(this.loggedDeprecations).includes(depHash) ||
        Date.now() - this.loggedDeprecations[depHash] >=
          HttpClient.DEPRECATION_ALERT_DELAY
      ) {
        this.loggedDeprecations[depHash] = Date.now();

        const stack = new Error().stack;
        const message = `API Deprecation Notice ${new Date().toLocaleString()} : ${JSON.stringify(
          deprecation,
        )}  -  Stack Trace: ${stack}`;
        await log.warning(message);
      }
    }

    return {
      body: body as T,
      headers: response.headers ?? {},
    };
  }
}

export function httpClientClass(
  config: ConfigInterface,
  scheme = 'https',
): typeof HttpClient {
  class NewHttpClient extends HttpClient {
    public static config = config;
    public static scheme = scheme;
  }

  Reflect.defineProperty(NewHttpClient, 'name', {
    value: 'HttpClient',
  });

  return NewHttpClient as typeof HttpClient;
}
