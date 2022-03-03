import querystring, {ParsedUrlQueryInput} from 'querystring';
import crypto from 'crypto';

import fetch, {RequestInit, Response} from 'node-fetch';
import {Method, StatusCode} from '@shopify/network';

import * as ShopifyErrors from '../../error';
import {SHOPIFY_API_LIBRARY_VERSION} from '../../version';
import validateShop from '../../utils/shop-validator';
import ProcessedQuery from '../../utils/processed-query';

import {
  DataType,
  DeleteRequestParams,
  GetRequestParams,
  PostRequestParams,
  PutRequestParams,
  RequestParams,
  RequestReturn,
} from './types';

class HttpClient {
  // 1 second
  static readonly RETRY_WAIT_TIME = 1000;
  // 5 minutes
  static readonly DEPRECATION_ALERT_DELAY = 300000;
  private LOGGED_DEPRECATIONS: {[key: string]: number} = {};

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
    return this.request({method: Method.Get, ...params});
  }

  /**
   * Performs a POST request on the given path.
   */
  public async post(params: PostRequestParams): Promise<RequestReturn> {
    return this.request({method: Method.Post, ...params});
  }

  /**
   * Performs a PUT request on the given path.
   */
  public async put(params: PutRequestParams): Promise<RequestReturn> {
    return this.request({method: Method.Put, ...params});
  }

  /**
   * Performs a DELETE request on the given path.
   */
  public async delete(params: DeleteRequestParams): Promise<RequestReturn> {
    return this.request({method: Method.Delete, ...params});
  }

  protected async request(params: RequestParams): Promise<RequestReturn> {
    const maxTries = params.tries ? params.tries : 1;
    if (maxTries <= 0) {
      throw new ShopifyErrors.HttpRequestError(
        `Number of tries must be >= 0, got ${maxTries}`,
      );
    }

    let userAgent = `Shopify API Library v${SHOPIFY_API_LIBRARY_VERSION} | Node ${process.version}`;


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
    let body = null;
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
                : querystring.stringify(data as ParsedUrlQueryInput);
            break;
          case DataType.GraphQL:
            body = data as string;
            break;
        }
        headers = {
          'Content-Type': type,
          'Content-Length': Buffer.byteLength(body as string),
          ...params.extraHeaders,
        };
      }
    }

    const url = `https://${this.domain}${this.getRequestPath(
      params.path,
    )}${ProcessedQuery.stringify(params.query)}`;
    const options: RequestInit = {
      method: params.method.toString(),
      headers,
      body,
    } as RequestInit;

    async function sleep(waitTime: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    let tries = 0;
    while (tries < maxTries) {
      try {
        return await this.doRequest(url, options);
      } catch (error) {
        tries++;
        if (error instanceof ShopifyErrors.HttpRetriableError) {
          // We're not out of tries yet, use them
          if (tries < maxTries) {
            let waitTime = HttpClient.RETRY_WAIT_TIME;
            if (
              error instanceof ShopifyErrors.HttpThrottlingError &&
              error.retryAfter
            ) {
              waitTime = error.retryAfter * 1000;
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

  private async doRequest(
    url: string,
    options: RequestInit,
  ): Promise<RequestReturn> {
    return fetch(url, options)
      .then(async (response: Response) => {
        const body = await response.json();

        if (response.ok) {
          if (
            response.headers &&
            response.headers.has('X-Shopify-API-Deprecated-Reason')
          ) {
            const deprecation = {
              message: response.headers.get('X-Shopify-API-Deprecated-Reason'),
              path: url,
            };

            const depHash = crypto
              .createHash('md5')
              .update(JSON.stringify(deprecation))
              .digest('hex');

            if (
              !Object.keys(this.LOGGED_DEPRECATIONS).includes(depHash) ||
              Date.now() - this.LOGGED_DEPRECATIONS[depHash] >=
                HttpClient.DEPRECATION_ALERT_DELAY
            ) {
              this.LOGGED_DEPRECATIONS[depHash] = Date.now();
              console.warn('API Deprecation Notice:', deprecation);
            }
          }

          return {
            body,
            headers: response.headers,
          };
        } else {
          const errorMessages: string[] = [];
          if (body.errors) {
            errorMessages.push(JSON.stringify(body.errors, null, 2));
          }
          if (response.headers && response.headers.get('x-request-id')) {
            errorMessages.push(
              `If you report this error, please include this id: ${response.headers.get(
                'x-request-id',
              )}`,
            );
          }

          const errorMessage = errorMessages.length
            ? `:\n${errorMessages.join('\n')}`
            : '';
          switch (true) {
            case response.status === StatusCode.TooManyRequests: {
              const retryAfter = response.headers.get('Retry-After');
              throw new ShopifyErrors.HttpThrottlingError(
                `Shopify is throttling requests${errorMessage}`,
                retryAfter ? parseFloat(retryAfter) : undefined,
              );
            }
            case response.status >= StatusCode.InternalServerError:
              throw new ShopifyErrors.HttpInternalError(
                `Shopify internal error${errorMessage}`,
              );
            default:
              throw new ShopifyErrors.HttpResponseError(
                `Received an error response (${response.status} ${response.statusText}) from Shopify${errorMessage}`,
                response.status,
                response.statusText,
              );
          }
        }
      })
      .catch((error) => {
        if (error instanceof ShopifyErrors.ShopifyError) {
          throw error;
        } else {
          throw new ShopifyErrors.HttpRequestError(
            `Failed to make Shopify HTTP request: ${error}`,
          );
        }
      });
  }
}

export {HttpClient};
