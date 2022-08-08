import {Context} from '../../context';
import {ShopifyHeader} from '../../base-types';
import {HttpClient} from '../http_client/http_client';
import {DataType, RequestReturn} from '../http_client/types';
import * as ShopifyErrors from '../../error';

import {GraphqlParams} from './types';

export interface AccessTokenHeader {
  header: string;
  value: string;
}

export class GraphqlClient {
  protected baseApiPath = '/admin/api';

  private readonly client: HttpClient;

  constructor(readonly domain: string, readonly accessToken?: string) {
    if (!Context.IS_PRIVATE_APP && !accessToken) {
      throw new ShopifyErrors.MissingRequiredArgument(
        'Missing access token when creating GraphQL client',
      );
    }

    this.client = new HttpClient(this.domain);
  }

  async query<T = unknown>(params: GraphqlParams): Promise<RequestReturn<T>> {
    if (params.data.length === 0) {
      throw new ShopifyErrors.MissingRequiredArgument('Query missing.');
    }

    const accessTokenHeader = this.getAccessTokenHeader();
    params.extraHeaders = {
      [accessTokenHeader.header]: accessTokenHeader.value,
      ...params.extraHeaders,
    };

    const path = `${this.baseApiPath}/${Context.API_VERSION}/graphql.json`;

    let dataType: DataType.GraphQL | DataType.JSON;

    if (typeof params.data === 'object') {
      dataType = DataType.JSON;
    } else {
      dataType = DataType.GraphQL;
    }

    const result = await this.client.post<T>({path, type: dataType, ...params});

    if ((result.body as unknown as {[key: string]: unknown}).errors) {
      throw new ShopifyErrors.GraphqlQueryError({
        message: 'GraphQL query returned errors',
        response: result.body as unknown as {[key: string]: unknown},
      });
    }
    return result;
  }

  protected getAccessTokenHeader(): AccessTokenHeader {
    return {
      header: ShopifyHeader.AccessToken,
      value: Context.IS_PRIVATE_APP
        ? Context.API_SECRET_KEY
        : (this.accessToken as string),
    };
  }
}
