import { RestClient, RestRequestReturn } from './rest_client';
import querystring from 'querystring';

type PageInfoParams = {
  limit: number,
  fields?: string[],
  previousPageUrl?: string,
  nextPageUrl?: string,
};

class PageInfo {
  constructor(private params: PageInfoParams) {}

  /**
   * De-serializes an object's data and returns a new object with those params.
   *
   * @param content Serialized contents of the object
   */
  public static deserialize(content: string): PageInfo {
    const params: PageInfoParams = JSON.parse(content);

    return new PageInfo(params);
  }

  /**
   * Serializes this object into JSON so it can be safely stored.
   */
  public serialize(): string {
    return JSON.stringify(this.params);
  }

  /**
   * Requests the previous page for the information stored in this object.
   *
   * @param accessToken Current access token for the domain
   */
  public async getPreviousPage(accessToken: string): Promise<RestRequestReturn | null> {
    if (!this.params.previousPageUrl) {
      return null;
    }

    const url = new URL(this.params.previousPageUrl);
    const path = url.pathname.replace(/^\/admin\/api\/[^/]+\/(.*)\.json$/, '$1');
    const query = querystring.decode(url.search.replace(/^\?(.*)/, '$1')) as Record<string, string>;

    const client = new RestClient(url.hostname, accessToken);
    return client.get({
      path: path,
      query: query,
    });
  }

  /**
   * Requests the next page for the information stored in this object.
   *
   * @param accessToken Current access token for the domain
   */
  public async getNextPage(accessToken: string): Promise<RestRequestReturn | null> {
    if (!this.params.nextPageUrl) {
      return null;
    }

    const url = new URL(this.params.nextPageUrl);
    const path = url.pathname.replace(/^\/admin\/api\/[^/]+\/(.*)\.json$/, '$1');
    const query = querystring.decode(url.search.replace(/^\?(.*)/, '$1')) as Record<string, string>;

    const client = new RestClient(url.hostname, accessToken);
    return client.get({
      path: path,
      query: query,
    });
  }
}

export {
  PageInfo,
  PageInfoParams,
};
