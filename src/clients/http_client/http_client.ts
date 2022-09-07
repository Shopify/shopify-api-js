import {Method, StatusCode} from '@shopify/network';

import * as ShopifyErrors from '../../error';
import {SHOPIFY_API_LIBRARY_VERSION} from '../../version';
import ProcessedQuery from '../../utils/processed-query';
import {ConfigInterface, LogSeverity} from '../../base-types';
import {createSHA256HMAC} from '../../runtime/crypto';
import {HmacReturnFormat} from '../../runtime/crypto/types';
import {
  abstractFetch,
  canonicalizeHeaders,
  getHeader,
  isOK,
  NormalizedRequest,
  NormalizedResponse,
} from '../../runtime/http';

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

export function createHttpClientClass(config: ConfigInterface) {
  return class HttpClient {
    // 1 second
    static readonly RETRY_WAIT_TIME = 1000;
    // 5 minutes
    static readonly DEPRECATION_ALERT_DELAY = 300000;
    LOGGED_DEPRECATIONS: {[key: string]: number} = {};
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

    public async request<T = unknown>(
      params: RequestParams,
    ): Promise<RequestReturn<T>> {
      const maxTries = params.tries ? params.tries : 1;
      if (maxTries <= 0) {
        throw new ShopifyErrors.HttpRequestError(
          `Number of tries must be >= 0, got ${maxTries}`,
        );
      }

      let userAgent = `Shopify API Library v${SHOPIFY_API_LIBRARY_VERSION} | Node ${process.version}`;

      if (config.userAgentPrefix) {
        userAgent = `${config.userAgentPrefix} | ${userAgent}`;
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
        const {type, data} = params as PostRequestParams;
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
            'Content-Type': type,
            'Content-Length': Buffer.byteLength(body as string),
          };
        }
      }

      const url = `https://${this.domain}${this.getRequestPath(
        params.path,
      )}${ProcessedQuery.stringify(params.query)}`;
      const request: NormalizedRequest = {
        method: params.method,
        url,
        headers: canonicalizeHeaders(headers as any),
        body,
      };

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
              let waitTime = HttpClient.RETRY_WAIT_TIME;
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

    public getRequestPath(path: string): string {
      return `/${path.replace(/^\//, '')}`;
    }

    public async doRequest<T = unknown>(
      request: NormalizedRequest,
    ): Promise<RequestReturn<T>> {
      try {
        const response: NormalizedResponse = await abstractFetch(request);
        let body: {[key: string]: string} | T = {};

        if (response.body) {
          try {
            body = JSON.parse(response.body);
          } catch (error) {
            body = {};
          }
        }

        if (isOK(response)) {
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
              deprecation.body = `${(request.body as string).substring(
                0,
                100,
              )}...`;
            }

            const depHash = await createSHA256HMAC(
              config.apiSecretKey,
              JSON.stringify(deprecation),
              HmacReturnFormat.Hex,
            );

            if (
              !Object.keys(this.LOGGED_DEPRECATIONS).includes(depHash) ||
              Date.now() - this.LOGGED_DEPRECATIONS[depHash] >=
                HttpClient.DEPRECATION_ALERT_DELAY
            ) {
              this.LOGGED_DEPRECATIONS[depHash] = Date.now();

              if (config.logFunction) {
                const stack = new Error().stack;
                const log = `API Deprecation Notice ${new Date().toLocaleString()} : ${JSON.stringify(
                  deprecation,
                )}\n    Stack Trace: ${stack}\n`;
                await config.logFunction(LogSeverity.Warning, log);
              } else {
                console.warn('API Deprecation Notice:', deprecation);
              }
            }
          }

          return {
            body: body as T,
            headers: response.headers ?? {},
          };
        } else {
          const errorMessages: string[] = [];
          if ((body as any).errors) {
            errorMessages.push(JSON.stringify((body as any).errors, null, 2));
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
                body: body as any,
                headers,
                retryAfter: retryAfter ? parseFloat(retryAfter) : undefined,
              });
            }
            case response.statusCode >= StatusCode.InternalServerError:
              throw new ShopifyErrors.HttpInternalError({
                message: `Shopify internal error${errorMessage}`,
                code,
                statusText,
                body: body as any,
                headers,
              });
            default:
              throw new ShopifyErrors.HttpResponseError({
                message: `Received an error response (${response.statusCode} ${response.statusText}) from Shopify${errorMessage}`,
                code,
                statusText,
                body: body as any,
                headers,
              });
          }
        }
      } catch (error) {
        if (error instanceof ShopifyErrors.ShopifyError) {
          throw error;
        } else {
          throw new ShopifyErrors.HttpRequestError(
            `Failed to make Shopify HTTP request: ${error}`,
          );
        }
      }
    }
  };
}
