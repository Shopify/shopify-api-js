import { Context } from '../../context';
import { ShopifyHeader } from '../../types';
import { HttpClient, RequestParams, RequestReturn } from '../http_client';

type RestRequestReturn = RequestReturn & {
  pageInfo?: {
    limit: number,
    previousPageId?: string,
    nextPageId?: string,
    fields?: string[],
  },
};

class RestClient extends HttpClient {
  private static LINK_HEADER_REGEXP = /<([^<]+)>; rel="([^"]+)"/;

  private accessToken: string;

  public constructor(domain: string, accessToken: string) {
    super(domain);
    this.accessToken = accessToken;
  }

  protected async request(params: RequestParams): Promise<RestRequestReturn> {
    params.extraHeaders = Object.assign({}, params.extraHeaders);
    params.extraHeaders[ShopifyHeader.AccessToken] = this.accessToken;

    params.path = this.getRestPath(params.path);

    const ret = await super.request(params) as RestRequestReturn;

    const link = ret.headers.get('link');
    if (params.query && link) {
      ret.pageInfo = {
        limit: parseInt('' + params.query['limit']),
      };

      const links = link.split(', ');

      for (let i = 0; i < links.length; i++) {
        const parsedLink = links[i].match(RestClient.LINK_HEADER_REGEXP);
        if (!parsedLink) {
          continue;
        }

        const linkUrl = new URL(parsedLink[1]);
        const linkRel = parsedLink[2];
        const linkFields = linkUrl.searchParams.get('fields');
        const linkPageToken = linkUrl.searchParams.get('page_info');

        if (!ret.pageInfo.fields && linkFields) {
          ret.pageInfo.fields = linkFields.split(',');
        }

        if (linkPageToken) {
          switch (linkRel) {
            case 'previous':
              ret.pageInfo.previousPageId = linkPageToken;
              break;
            case 'next':
              ret.pageInfo.nextPageId = linkPageToken;
              break;
          }
        }
      }
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
