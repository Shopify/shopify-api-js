import {Method, StatusCode} from '@shopify/network';

import {
  getHeader,
  isOK,
  abstractFetch,
  Headers,
  Request,
  Response,
} from '../../runtime/http';
import {hashStringWithSHA256} from '../../runtime/crypto';
import * as ShopifyErrors from '../../error';
import {SHOPIFY_API_LIBRARY_VERSION} from '../../version';
import validateShop from '../../utils/shop-validator';
import {Context, LOG_SEVERITY} from '../../context';
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

    const extraHeaders = params.extraHeaders ?? {};

    let userAgent = `Shopify API Library v${SHOPIFY_API_LIBRARY_VERSION} | Node ${process.version}`;

    if (Context.USER_AGENT_PREFIX) {
      userAgent = `${Context.USER_AGENT_PREFIX} | ${userAgent}`;
    }

    if (extraHeaders) {
      if (extraHeaders['user-agent']) {
        userAgent = `${extraHeaders['user-agent']} | ${userAgent}`;
        delete extraHeaders['user-agent'];
      } else if (extraHeaders['User-Agent']) {
        userAgent = `${extraHeaders['User-Agent']} | ${userAgent}`;
      }
    }

    let headers: Headers = {
      ...extraHeaders,
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
                : new URLSearchParams(data as any).toString();
            break;
          case DataType.GraphQL:
            body = data as string;
            break;
        }
        headers = {
          'Content-Type': type,
          'Content-Length': Buffer.byteLength(body as string).toString(),
          ...extraHeaders,
        };
      }
    }

    let query = ProcessedQuery.stringify(params.query);
    if (query.length > 0) {
      query = `?${query}`;
    }
    const url = `https://${this.domain}${this.getRequestPath(
      params.path,
    )}${query}`;

    const req: Request = {
      url,
      method: params.method.toString(),
      headers,
      body,
    };

    async function sleep(waitTime: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    let tries = 0;
    while (tries < maxTries) {
      try {
        return await this.doRequest(req);
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

  private throwFailedRequest(response: Response) {
    const body = JSON.parse(response.body!);
    const errorMessages: string[] = [];
    if (body.errors) {
      errorMessages.push(JSON.stringify(body.errors, null, 2));
    }
    const requestId = getHeader(response.headers, 'x-request-id');
    if (requestId) {
      errorMessages.push(
        `If you report this error, please include this id: ${requestId}`,
      );
    }

    const errorMessage = errorMessages.length
      ? `:\n${errorMessages.join('\n')}`
      : '';
    switch (true) {
      case response.statusCode === StatusCode.TooManyRequests: {
        const retryAfter = getHeader(response.headers, 'Retry-After');
        throw new ShopifyErrors.HttpThrottlingError(
          `Shopify is throttling requests${errorMessage}`,
          retryAfter ? parseFloat(retryAfter) : undefined,
        );
      }
      case response.statusCode >= StatusCode.InternalServerError:
        throw new ShopifyErrors.HttpInternalError(
          `Shopify internal error${errorMessage}`,
        );
      default:
        throw new ShopifyErrors.HttpResponseError(
          `Received an error response (${response.statusCode} ${response.statusText}) from Shopify${errorMessage}`,
          response.statusCode,
          response.statusText,
        );
    }
    // Unreachable. We’ll have *definitely* thrown by this point.
    // return;
  }

  private async doRequest(req: Request): Promise<RequestReturn> {
    const response = await abstractFetch(req);

    if (!isOK(response)) {
      this.throwFailedRequest(response);
    }

    const body = JSON.parse(response.body!);
    const deprecationReason = getHeader(
      response.headers,
      'X-Shopify-API-Deprecated-Reason',
    );
    if (deprecationReason) {
      const deprecation = {
        message: deprecationReason,
        path: req.url,
      };

      const depHash = await hashStringWithSHA256(JSON.stringify(deprecation));

      if (
        !Object.keys(this.LOGGED_DEPRECATIONS).includes(depHash) ||
        Date.now() - this.LOGGED_DEPRECATIONS[depHash] >=
          HttpClient.DEPRECATION_ALERT_DELAY
      ) {
        this.LOGGED_DEPRECATIONS[depHash] = Date.now();

        if (Context.LOG_FUNCTION) {
          const stack = new Error().stack;
          const log = `API Deprecation Notice ${new Date().toLocaleString()} : ${JSON.stringify(
            deprecation,
          )}\n    Stack Trace: ${stack}\n`;
          await Context.LOG_FUNCTION(LOG_SEVERITY.Warning, log);
        } else {
          console.warn('API Deprecation Notice:', deprecation);
        }
      }
    }

    return {
      body,
      headers: response.headers ?? {},
    };
  }
}

export {HttpClient};
