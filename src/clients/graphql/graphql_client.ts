import { Context } from '../../context'
import { ShopifyHeader } from '../../types';
import { DataType, HttpClient, PostRequestParams } from '../http_client';

type GraphqlParams = Omit<PostRequestParams, "path" | "type">;

export class GraphqlClient extends HttpClient{
  constructor(domain: string, readonly token: string) {
    super(domain);
  }

  async query(params: GraphqlParams): Promise<unknown> {
    params.extraHeaders = Object.assign({ [ShopifyHeader.AccessToken]: this.token }, params.extraHeaders);

    const path = `/admin/api/${Context.API_VERSION}/graphql.json`
    return super.post({ path: path, type: DataType.GraphQL, ...params });
  }
}

