import {Context} from '../../context';
import {ShopifyHeader} from '../../base_types';
import {HttpClient} from '../http_client/http_client';
import {DataType, RequestReturn} from '../http_client/types';

import {GraphqlParams} from './types';

export class GraphqlClient {
  private readonly client: HttpClient;

  constructor(readonly domain: string, readonly token: string) {
    this.client = new HttpClient(this.domain);
  }

  async query(params: GraphqlParams): Promise<RequestReturn> {
    params.extraHeaders = {[ShopifyHeader.AccessToken]: this.token, ...params.extraHeaders};
    const path = `/admin/api/${Context.API_VERSION}/graphql.json`;

    return this.client.post({path, type: DataType.GraphQL, ...params});
  }
}
