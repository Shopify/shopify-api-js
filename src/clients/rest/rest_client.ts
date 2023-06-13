import querystring from 'querystring';

import {Context} from '../../context';
import {ShopifyHeader} from '../../types';
import {HttpClient} from '../http_client/http_client';
import {RequestParams, GetRequestParams} from '../http_client/types';

import {RestRequestReturn, PageInfo} from './types';

class RestClient extends HttpClient {
  private static LINK_HEADER_REGEXP = /<([^<]+)>; rel="([^"]+)"/;

  private accessToken: string;

  public constructor(domain: string, accessToken: string) {
    super(domain);
    this.accessToken = accessToken;
  }

  protected async request(params: RequestParams): Promise<RestRequestReturn> {
    params.extraHeaders = {...params.extraHeaders};
    params.extraHeaders[ShopifyHeader.AccessToken] = this.accessToken;

    params.path = this.getRestPath(params.path);

    const ret = (await super.request(params)) as RestRequestReturn;

    const link = ret.headers.get('link');
    if (params.query && link !== undefined) {
      const pageInfo: PageInfo = {
        limit: params.query.limit.toString(),
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

  private getRestPath(path: string): string {
    return `/admin/api/${Context.API_VERSION}/${path}.json`;
  }

  private buildRequestParams(newPageUrl: string): GetRequestParams {
    const url = new URL(newPageUrl);
    const path = url.pathname.replace(/^\/admin\/api\/[^/]+\/(.*)\.json$/, '$1');
    const query = querystring.decode(url.search.replace(/^\?(.*)/, '$1')) as Record<string, string | number>;
    return {
      path,
      query,
    };
  }
}

export {RestClient};
