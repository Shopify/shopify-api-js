import querystring, { ParsedUrlQueryInput } from 'querystring';
import fetch, { RequestInit, Response } from 'node-fetch';
import { Method, StatusCode } from '@shopify/network';
import ShopifyErrors from '../error';

type HeaderParams = {[key: string]: string};

type RequestParams = {
  method: Method,
  path: string,
  extraHeaders?: HeaderParams,
  postData?: ParsedUrlQueryInput,
  maxRetries?: number,
};

class HttpClient {
  public constructor(private domain: string) {
    this.domain = domain;
  }

  /**
   * Performs a GET request on the given path.
   *
   * @param path Path to query
   * @param extraHeaders Extra headers to send along with the request
   */
  public async get(path: string, extraHeaders?: HeaderParams): Promise<unknown> {
    return this.request({
      method: Method.Get,
      path: path,
      extraHeaders: extraHeaders,
    });
  }

  /**
   * Performs a POST request on the given path.
   *
   * @param path Path to query
   * @param data Data to send
   * @param extraHeaders Extra headers to send along with the request
   */
  public async post(
    path: string,
    data: ParsedUrlQueryInput,
    extraHeaders?: HeaderParams
  ): Promise<unknown> {
    return this.request({
      method: Method.Post,
      path: path,
      postData: data,
      extraHeaders: extraHeaders,
    });
  }

  /**
   * Performs a PUT request on the given path.
   *
   * @param path Path to query
   * @param data Data to send
   * @param extraHeaders Extra headers to send along with the request
   */
  public async put(
    path: string,
    data: ParsedUrlQueryInput,
    extraHeaders?: HeaderParams
  ): Promise<unknown> {
    return this.request({
      method: Method.Put,
      path: path,
      postData: data,
      extraHeaders: extraHeaders,
    });
  }

  /**
   * Performs a DELETE request on the given path.
   *
   * @param path Path to query
   * @param extraHeaders Extra headers to send along with the request
   */
  public async delete(path: string, extraHeaders?: HeaderParams): Promise<unknown> {
    return this.request({
      method: Method.Delete,
      path: path,
      extraHeaders: extraHeaders,
    });
  }

  protected async request({
    method,
    path,
    extraHeaders,
    postData,
  }: RequestParams): Promise<unknown> {
    let parsedPostData: string | null = null;
    if (postData) {
      parsedPostData = querystring.stringify(postData);
    }

    const headers = Object.assign(
      {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': parsedPostData ? Buffer.byteLength(parsedPostData) : 0
      },
      extraHeaders,
    );

    const url = `https://${this.domain}${path}`;
    const options: RequestInit = {
      method: method.toString(),
      headers: headers,
      body: parsedPostData,
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
};
