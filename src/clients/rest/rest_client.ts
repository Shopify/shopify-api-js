import querystring from 'querystring';

import {Context} from '../../context';
import {ShopifyHeader} from '../../base-types';
import {HttpClient} from '../http_client/http_client';
import {RequestParams, GetRequestParams} from '../http_client/types';
import * as ShopifyErrors from '../../error';

import {RestRequestReturn, PageInfo} from './types';

class RestClient extends HttpClient {
  private static LINK_HEADER_REGEXP = /<([^<]+)>; rel="([^"]+)"/;
  private static DEFAULT_LIMIT = '50';

  public constructor(domain: string, readonly accessToken?: string) {
    super(domain);

    if (!Context.IS_PRIVATE_APP && !accessToken) {
      throw new ShopifyErrors.MissingRequiredArgument(
        'Missing access token when creating REST client',
      );
    }
  }

  protected async request<T = unknown>(
    params: RequestParams,
  ): Promise<RestRequestReturn<T>> {
    params.extraHeaders = {
      [ShopifyHeader.AccessToken]: Context.IS_PRIVATE_APP
        ? Context.API_SECRET_KEY
        : (this.accessToken as string),
      ...params.extraHeaders,
    };

    const ret: RestRequestReturn<T> = await super.request<T>(params);

    const link = ret.headers.get('link');
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
      return `/admin/api/${Context.API_VERSION}${cleanPath.replace(
        /\.json$/,
        '',
      )}.json`;
    }
  }

  private buildRequestParams(newPageUrl: string): GetRequestParams {
    const pattern = `^/admin/api/[^/]+/(.*).json$`;

    const url = new URL(newPageUrl);
    const path = url.pathname.replace(new RegExp(pattern), '$1');
    const query = querystring.decode(url.search.replace(/^\?(.*)/, '$1')) as {
      [key: string]: string | number;
    };
    return {
      path,
      query,
    };
  }
}

export {RestClient};
