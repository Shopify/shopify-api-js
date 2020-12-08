import { Context } from '../../context'
import { ShopifyHeader } from '../../types';
import { DataType, PostRequestParams, PostRequest } from '../http_client';

type GraphqlParams = Omit<PostRequestParams, "path" | "type">;

export class GraphqlClient {
  constructor(readonly domain: string, readonly token: string) {
  }

  async query(params: GraphqlParams): Promise<unknown> {
    params.extraHeaders = Object.assign({ [ShopifyHeader.AccessToken]: this.token }, params.extraHeaders);

    const path = `/admin/api/${Context.API_VERSION}/graphql.json`
    return Graphql.post(this.domain, { path: path, type: DataType.GraphQL, ...params });
  }
}
const Graphql = PostRequest(GraphqlClient);