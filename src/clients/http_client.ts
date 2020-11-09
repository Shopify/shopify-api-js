import querystring, { ParsedUrlQueryInput } from 'querystring';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
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

    const options: AxiosRequestConfig = {
      baseURL: `https://${this.domain}`,
      url: path,
      method: method.toString(),
      headers: headers,
      data: parsedPostData,
    } as AxiosRequestConfig;

    return this.doRequest(options);
  }

  private async doRequest(options: AxiosRequestConfig): Promise<unknown> {
    return axios.request(options)
      .then((response: AxiosResponse) => response.data)
      .catch((error: AxiosError) => {
        const status = error.response ? error.response.status : -1;
        switch (true) {
          case status === StatusCode.TooManyRequests:
            return Promise.reject(new ShopifyErrors.HttpThrottlingError(`Shopify is throttling requests: ${error.message}`));
          case status >= StatusCode.InternalServerError:
            return Promise.reject(new ShopifyErrors.HttpInternalError(`Shopify internal error: ${error.message}`));
          case status === -1:
            return Promise.reject(new ShopifyErrors.HttpRequestError(`Failed to make Shopify HTTP request: ${error.message}`));
          default:
            return Promise.reject(new ShopifyErrors.HttpResponseError(`Received an error response from Shopify: ${error.message}`, status));
        }
      });
  }
}

export {
  HttpClient,
  RequestParams,
};
