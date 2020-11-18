import fetch, { RequestInit, Response } from 'node-fetch';
import querystring, { ParsedUrlQueryInput } from 'querystring';
import { Method, StatusCode } from '@shopify/network';
import ShopifyErrors from '../error';

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
  maxRetries?: number,
}

type PostRequestParams = GetRequestParams & {
  type: DataType,
  data: Record<string, unknown> | string,
}

type PutRequestParams = PostRequestParams;

type DeleteRequestParams = GetRequestParams;

type RequestParams = (GetRequestParams | PostRequestParams) & { method: Method }

class HttpClient {
  public constructor(private domain: string) {
    this.domain = domain;
  }

  /**
   * Performs a GET request on the given path.
   *
   * @param path Path to query
   * @param extraHeaders Extra headers to send along with the request (optional)
   */
  public async get(params: GetRequestParams): Promise<unknown> {
    return this.request({ method: Method.Get, ...params });
  }

  /**
   * Performs a POST request on the given path.
   *
   * @param path Path to query
   * @param type Type of data (URL encoded string, JSON, GraphQL)
   * @param data Data to send
   * @param extraHeaders Extra headers to send along with the request
   */
  public async post(params: PostRequestParams): Promise<unknown> {
    return this.request({ method: Method.Post, ...params });
  }

  /**
   * Performs a PUT request on the given path.
   *
   * @param path Path to query
   * @param type Type of data (URL encoded string, JSON, GraphQL)
   * @param data Data to send
   * @param extraHeaders Extra headers to send along with the request
   */
  public async put(params: PutRequestParams): Promise<unknown> {
    return this.request({ method: Method.Put, ...params });
  }

  /**
   * Performs a DELETE request on the given path.
   *
   * @param path Path to query
   * @param extraHeaders Extra headers to send along with the request
   */
  public async delete(params: DeleteRequestParams): Promise<unknown> {
    return this.request({ method: Method.Delete, ...params });
  }

  protected async request(params: RequestParams): Promise<unknown> {
    let headers = params.extraHeaders;
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
    const url = `https://${this.domain}${params.path}`;
    const options: RequestInit = {
      method: params.method.toString(),
      headers: headers,
      body: body
    } as RequestInit;

    return this.doRequest(url, options);
  }

  private async doRequest(url: string, options: RequestInit): Promise<unknown> {
    return fetch(url, options)
      .then(async (response: Response) => {
        const body = await response.json();

        if (response.ok) {
          return body;
        }
        else {
          switch (true) {
            case response.status === StatusCode.TooManyRequests:
              throw new ShopifyErrors.HttpThrottlingError(`Shopify is throttling requests: ${body.errors}`);
            case response.status >= StatusCode.InternalServerError:
              throw new ShopifyErrors.HttpInternalError(`Shopify internal error: ${body.errors}`);
            default:
              throw new ShopifyErrors.HttpResponseError(`Received an error response from Shopify: ${body.errors}`, response.status);
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
  RequestParams,
  DataType,
};
