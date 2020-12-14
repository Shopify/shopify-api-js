import { Context } from '../../context'
import { GraphqlParams } from './types';
import { ShopifyHeader } from '../../types';
import { DataType, HttpClient } from '../http_client';

export class GraphqlClient{
  private readonly client: HttpClient;

  constructor(readonly domain: string, readonly token: string) {
    this.client = new HttpClient(this.domain);
  }

  async query(params: GraphqlParams): Promise<unknown> {
    params.extraHeaders = Object.assign({ [ShopifyHeader.AccessToken]: this.token }, params.extraHeaders);
    const path = `/admin/api/${Context.API_VERSION}/graphql.json`;

    return this.client.post({ path: path, type: DataType.GraphQL, ...params });
  }
}
