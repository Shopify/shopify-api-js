import {getHeader} from '../../../runtime/http';
import {ApiVersion, ShopifyHeader} from '../../types';
import {ConfigInterface} from '../../base-types';
import {RequestParams} from '../http_client/types';
import * as ShopifyErrors from '../../error';
import {HttpClient} from '../http_client/http_client';
import {Session} from '../../session/session';
import {logger} from '../../logger';

import {
  RestRequestReturn,
  PageInfo,
  RestClientParams,
  PageInfoParams,
} from './types';

export interface RestClientClassParams {
  config: ConfigInterface;
}

export class RestClient extends HttpClient {
  static LINK_HEADER_REGEXP = /<([^<]+)>; rel="([^"]+)"/;
  static DEFAULT_LIMIT = '50';

  public static config: ConfigInterface;

  readonly session: Session;
  readonly apiVersion?: ApiVersion;

  public constructor(params: RestClientParams) {
    super({domain: params.session.shop});

    const config = this.restClass().config;

    if (!config.isCustomStoreApp && !params.session.accessToken) {
      throw new ShopifyErrors.MissingRequiredArgument(
        'Missing access token when creating REST client',
      );
    }

    if (params.apiVersion) {
      const message =
        params.apiVersion === config.apiVersion
          ? `REST client has a redundant API version override to the default ${params.apiVersion}`
          : `REST client overriding default API version ${config.apiVersion} with ${params.apiVersion}`;

      logger(config).debug(message);
    }

    this.session = params.session;
    this.apiVersion = params.apiVersion;
  }

  protected async request<T = unknown>(
    params: RequestParams,
  ): Promise<RestRequestReturn<T>> {
    const customStoreAppAccessToken =
      this.restClass().config.adminApiAccessToken ??
      this.restClass().config.apiSecretKey;
    params.extraHeaders = {
      [ShopifyHeader.AccessToken]: this.restClass().config.isCustomStoreApp
        ? customStoreAppAccessToken
        : (this.session.accessToken as string),
      ...params.extraHeaders,
    };

    const ret: RestRequestReturn<T> = await super.request<T>(params);

    const link = getHeader(ret.headers, 'link');
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

      ret.pageInfo = pageInfo;
    }

    return ret;
  }

  protected getRequestPath(path: string): string {
    const cleanPath = super.getRequestPath(path);
    if (cleanPath.startsWith('/admin')) {
      return `${cleanPath.replace(/\.json$/, '')}.json`;
    } else {
      return `/admin/api/${
        this.apiVersion || this.restClass().config.apiVersion
      }${cleanPath.replace(/\.json$/, '')}.json`;
    }
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
}

export function restClientClass(
  params: RestClientClassParams,
): typeof RestClient {
  const {config} = params;

  class NewRestClient extends RestClient {
    public static config = config;
    public static scheme = 'https';
  }

  Reflect.defineProperty(NewRestClient, 'name', {
    value: 'RestClient',
  });

  return NewRestClient as typeof RestClient;
}
