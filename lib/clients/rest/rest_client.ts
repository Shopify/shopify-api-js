import {getHeader} from '../../../runtime/http';
import {ApiVersion, LogSeverity, ShopifyHeader} from '../../types';
import {ConfigInterface} from '../../base-types';
import {RequestParams, GetRequestParams} from '../http_client/types';
import * as ShopifyErrors from '../../error';
import {HttpClient} from '../http_client/http_client';
import {Session} from '../../session/session';

import {RestRequestReturn, PageInfo, RestClientParams} from './types';

export interface RestClientClassParams {
  config: ConfigInterface;
}

export class RestClient extends HttpClient {
  static LINK_HEADER_REGEXP = /<([^<]+)>; rel="([^"]+)"/;
  static DEFAULT_LIMIT = '50';

  public static CONFIG: ConfigInterface;

  readonly session: Session;
  readonly apiVersion?: ApiVersion;

  public constructor(params: RestClientParams) {
    super({domain: params.session.shop});

    if (!this.restClass().CONFIG.isPrivateApp && !params.session.accessToken) {
      throw new ShopifyErrors.MissingRequiredArgument(
        'Missing access token when creating REST client',
      );
    }

    if (params.apiVersion) {
      this.restClass().CONFIG.logger.log(
        LogSeverity.Debug,
        `REST client overriding API version to ${params.apiVersion}`,
      );
    }

    this.session = params.session;
    this.apiVersion = params.apiVersion;
  }

  protected async request<T = unknown>(
    params: RequestParams,
  ): Promise<RestRequestReturn<T>> {
    params.extraHeaders = {
      [ShopifyHeader.AccessToken]: this.restClass().CONFIG.isPrivateApp
        ? this.restClass().CONFIG.apiSecretKey
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
        this.apiVersion || this.restClass().CONFIG.apiVersion
      }${cleanPath.replace(/\.json$/, '')}.json`;
    }
  }

  private restClass() {
    return this.constructor as typeof RestClient;
  }

  private buildRequestParams(newPageUrl: string): GetRequestParams {
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
    public static CONFIG = config;
    public static SCHEME = 'https';
  }

  Reflect.defineProperty(NewRestClient, 'name', {
    value: 'RestClient',
  });

  return NewRestClient as typeof RestClient;
}
