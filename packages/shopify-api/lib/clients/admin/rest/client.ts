import {
  AdminRestApiClient,
  createAdminRestApiClient,
} from '@shopify/admin-api-client';
import {Method} from '@shopify/network';

import {
  clientLoggerFactory,
  getUserAgent,
  throwFailedRequest,
} from '../../common';
import {
  HashFormat,
  NormalizedRequest,
  abstractFetch,
  canonicalizeHeaders,
  createSHA256HMAC,
  getHeader,
} from '../../../../runtime';
import {ConfigInterface} from '../../../base-types';
import * as ShopifyErrors from '../../../error';
import {logger} from '../../../logger';
import {
  RestRequestReturn,
  PageInfo,
  RestClientParams,
  PageInfoParams,
} from '../types';
import type {
  RequestParams,
  GetRequestParams,
  PutRequestParams,
  PostRequestParams,
  DeleteRequestParams,
} from '../../types';
import {ApiVersion} from '../../../types';
import {Session} from '../../../session/session';

export interface RestClientClassParams {
  config: ConfigInterface;
  formatPaths?: boolean;
}

interface DeprecationInterface {
  message: string | null;
  path: string;
  body?: string;
}

export class RestClient {
  public static config: ConfigInterface;
  public static formatPaths: boolean;

  static LINK_HEADER_REGEXP = /<([^<]+)>; rel="([^"]+)"/;
  static DEFAULT_LIMIT = '50';
  static RETRY_WAIT_TIME = 1000;

  static readonly DEPRECATION_ALERT_DELAY = 300000;
  loggedDeprecations: Record<string, number> = {};

  readonly client: AdminRestApiClient;
  readonly session: Session;
  readonly apiVersion: ApiVersion;

  public constructor({session, apiVersion}: RestClientParams) {
    const config = this.restClass().config;

    if (!config.isCustomStoreApp && !session.accessToken) {
      throw new ShopifyErrors.MissingRequiredArgument(
        'Missing access token when creating REST client',
      );
    }

    if (apiVersion) {
      const message =
        apiVersion === config.apiVersion
          ? `REST client has a redundant API version override to the default ${apiVersion}`
          : `REST client overriding default API version ${config.apiVersion} with ${apiVersion}`;

      logger(config).debug(message);
    }

    const customStoreAppAccessToken =
      config.adminApiAccessToken ?? config.apiSecretKey;

    this.session = session;
    this.apiVersion = apiVersion ?? config.apiVersion;
    this.client = createAdminRestApiClient({
      scheme: config.hostScheme,
      storeDomain: session.shop,
      apiVersion: apiVersion ?? config.apiVersion,
      accessToken: config.isCustomStoreApp
        ? customStoreAppAccessToken
        : session.accessToken!,
      customFetchApi: abstractFetch,
      logger: clientLoggerFactory(config),
      userAgentPrefix: getUserAgent(config),
      defaultRetryTime: this.restClass().RETRY_WAIT_TIME,
      formatPaths: this.restClass().formatPaths,
    });
  }

  /**
   * Performs a GET request on the given path.
   */
  public async get<T = any>(params: GetRequestParams) {
    return this.request<T>({method: Method.Get, ...params});
  }

  /**
   * Performs a POST request on the given path.
   */
  public async post<T = any>(params: PostRequestParams) {
    return this.request<T>({method: Method.Post, ...params});
  }

  /**
   * Performs a PUT request on the given path.
   */
  public async put<T = any>(params: PutRequestParams) {
    return this.request<T>({method: Method.Put, ...params});
  }

  /**
   * Performs a DELETE request on the given path.
   */
  public async delete<T = any>(params: DeleteRequestParams) {
    return this.request<T>({method: Method.Delete, ...params});
  }

  protected async request<T = any>(
    params: RequestParams,
  ): Promise<RestRequestReturn<T>> {
    const requestParams = {
      headers: {
        ...params.extraHeaders,
        ...(params.type ? {'Content-Type': params.type.toString()} : {}),
      },
      retries: params.tries ? params.tries - 1 : undefined,
      searchParams: params.query,
    };

    let response: Response;
    switch (params.method) {
      case Method.Get:
        response = await this.client.get(params.path, requestParams);
        break;
      case Method.Put:
        response = await this.client.put(params.path, {
          ...requestParams,
          data: params.data!,
        });
        break;
      case Method.Post:
        response = await this.client.post(params.path, {
          ...requestParams,
          data: params.data!,
        });
        break;
      case Method.Delete:
        response = await this.client.delete(params.path, requestParams);
        break;
      default:
        throw new ShopifyErrors.InvalidRequestError(
          `Unsupported request method '${params.method}'`,
        );
    }

    const body: any = await response.json();
    const responseHeaders = canonicalizeHeaders(
      Object.fromEntries(response.headers.entries()),
    );

    if (!response.ok) {
      throwFailedRequest(body, (params.tries ?? 1) > 1, response);
    }

    const requestReturn: RestRequestReturn<T> = {
      body,
      headers: responseHeaders,
    };

    await this.logDeprecations(
      {
        method: params.method,
        url: params.path,
        headers: requestParams.headers,
        body: params.data ? JSON.stringify(params.data) : undefined,
      },
      requestReturn,
    );

    const link = response.headers.get('Link');
    if (link !== undefined) {
      const pageInfo: PageInfo = {
        limit: params.query?.limit
          ? params.query?.limit.toString()
          : RestClient.DEFAULT_LIMIT,
      };

      if (link) {
        const links = link.split(', ');

        for (const link of links) {
          const parsedLink = link.match(RestClient.LINK_HEADER_REGEXP);
          if (!parsedLink) {
            continue;
          }

          const linkRel = parsedLink[2];
          const linkUrl = new URL(parsedLink[1]);
          const linkFields = linkUrl.searchParams.get('fields');
          const linkPageToken = linkUrl.searchParams.get('page_info');

          if (!pageInfo.fields && linkFields) {
            pageInfo.fields = linkFields.split(',');
          }

          if (linkPageToken) {
            switch (linkRel) {
              case 'previous':
                pageInfo.previousPageUrl = parsedLink[1];
                pageInfo.prevPage = this.buildRequestParams(parsedLink[1]);
                break;
              case 'next':
                pageInfo.nextPageUrl = parsedLink[1];
                pageInfo.nextPage = this.buildRequestParams(parsedLink[1]);
                break;
            }
          }
        }
      }

      requestReturn.pageInfo = pageInfo;
    }

    return requestReturn;
  }

  private restClass() {
    return this.constructor as typeof RestClient;
  }

  private buildRequestParams(newPageUrl: string): PageInfoParams {
    const pattern = `^/admin/api/[^/]+/(.*).json$`;

    const url = new URL(newPageUrl);
    const path = url.pathname.replace(new RegExp(pattern), '$1');
    return {
      path,
      query: Object.fromEntries(url.searchParams.entries()),
    };
  }

  private async logDeprecations(
    request: NormalizedRequest,
    response: RestRequestReturn,
  ) {
    const config = this.restClass().config;

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
        config.apiSecretKey,
        JSON.stringify(deprecation),
        HashFormat.Hex,
      );

      if (
        !Object.keys(this.loggedDeprecations).includes(depHash) ||
        Date.now() - this.loggedDeprecations[depHash] >=
          RestClient.DEPRECATION_ALERT_DELAY
      ) {
        this.loggedDeprecations[depHash] = Date.now();

        const stack = new Error().stack;
        const message = `API Deprecation Notice ${new Date().toLocaleString()} : ${JSON.stringify(
          deprecation,
        )}  -  Stack Trace: ${stack}`;
        await logger(config).warning(message);
      }
    }
  }
}

export function restClientClass(
  params: RestClientClassParams,
): typeof RestClient {
  const {config, formatPaths} = params;

  class NewRestClient extends RestClient {
    public static config = config;
    public static formatPaths = formatPaths === undefined ? true : formatPaths;
  }

  Reflect.defineProperty(NewRestClient, 'name', {
    value: 'RestClient',
  });

  return NewRestClient as typeof RestClient;
}
