import {getHeader} from '../../runtime/http';
import {ShopifyHeader} from '../../base-types';
import {RequestParams, GetRequestParams} from '../http_client/types';
import * as ShopifyErrors from '../../error';
import {createHttpClientClass} from '../http_client/http_client';
import {CreateClientClassParams} from '..';

import {RestRequestReturn, PageInfo} from './types';

export interface RestClientParams {
  domain: string;
  accessToken?: string;
}

export function createRestClientClass(params: CreateClientClassParams) {
  const {config} = params;
  let {HttpClient} = params;
  if (!HttpClient) {
    HttpClient = createHttpClientClass(params.config);
  }
  return class RestClient extends HttpClient {
    static LINK_HEADER_REGEXP = /<([^<]+)>; rel="([^"]+)"/;
    static DEFAULT_LIMIT = '50';

    readonly accessToken: string;

    public constructor({domain, accessToken}: RestClientParams) {
      super({domain});

      if (!config.isPrivateApp && !accessToken) {
        throw new ShopifyErrors.MissingRequiredArgument(
          'Missing access token when creating REST client',
        );
      }
      if (accessToken) {
        this.accessToken = accessToken;
      }
    }

    public async request<T = unknown>(
      params: RequestParams,
    ): Promise<RestRequestReturn<T>> {
      params.extraHeaders = {
        [ShopifyHeader.AccessToken]: config.isPrivateApp
          ? config.apiSecretKey
          : (this.accessToken as string),
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

    public getRequestPath(path: string): string {
      const cleanPath = super.getRequestPath(path);
      if (cleanPath.startsWith('/admin')) {
        return `${cleanPath.replace(/\.json$/, '')}.json`;
      } else {
        return `/admin/api/${config.apiVersion}${cleanPath.replace(
          /\.json$/,
          '',
        )}.json`;
      }
    }

    public buildRequestParams(newPageUrl: string): GetRequestParams {
      const pattern = `^/admin/api/[^/]+/(.*).json$`;

      const url = new URL(newPageUrl);
      const path = url.pathname.replace(new RegExp(pattern), '$1');
      return {
        path,
        query: Object.fromEntries(url.searchParams.entries()),
      };
    }
  };
}
