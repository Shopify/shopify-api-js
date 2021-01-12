import {Context} from '../../context';
import {ShopifyHeader} from '../../types';
import {HttpClient, RequestParams} from '../http_client';

import {PageInfo, PageInfoParams} from './page_info';
import {RestRequestReturn} from './types';

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

    const ret = await super.request(params) as RestRequestReturn;

    const link = ret.headers.get('link');
    if (params.query && link !== undefined) {
      const pageInfoParams: PageInfoParams = {
        limit: parseInt(`${params.query.limit}`),
      };

      if (link) {
        const links = link.split(', ');

        for (let i = 0; i < links.length; i++) {
          const parsedLink = links[i].match(RestClient.LINK_HEADER_REGEXP);
          if (!parsedLink) {
            continue;
          }

          const linkRel = parsedLink[2];
          const linkUrl = new URL(parsedLink[1]);
          const linkFields = linkUrl.searchParams.get('fields');
          const linkPageToken = linkUrl.searchParams.get('page_info');

          if (!pageInfoParams.fields && linkFields) {
            pageInfoParams.fields = linkFields.split(',');
          }

          if (linkPageToken) {
            switch (linkRel) {
              case 'previous':
                pageInfoParams.previousPageUrl = parsedLink[1];
                break;
              case 'next':
                pageInfoParams.nextPageUrl = parsedLink[1];
                break;
            }
          }
        }
      }

      ret.pageInfo = new PageInfo(pageInfoParams);
    }

    return ret;
  }

  private getRestPath(path: string): string {
    return `/admin/api/${Context.API_VERSION}/${path}.json`;
  }
}

export {
  RestClient,
  RestRequestReturn,
};
