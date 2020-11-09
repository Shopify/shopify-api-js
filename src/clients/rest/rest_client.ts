import { ShopifyHeader } from '../../types';
import { HttpClient, RequestParams } from '../http_client';

export class RestClient extends HttpClient {
  private accessToken: string;

  public constructor(domain: string, accessToken: string) {
    super(domain);
    this.accessToken = accessToken;
  }

  protected async request(params: RequestParams): Promise<unknown> {
    params.extraHeaders = Object.assign({}, params.extraHeaders);
    params.extraHeaders[ShopifyHeader.AccessToken] = this.accessToken;

    params.path = this.getRestPath(params.path);

    return super.request(params);
  }

  private getRestPath(path: string): string {
    return `/admin/${path}.json`;
  }
}
