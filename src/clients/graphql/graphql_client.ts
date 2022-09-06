import {ShopifyHeader} from '../../base-types';
import {createHttpClientClass} from '../http_client/http_client';
import {DataType, RequestReturn} from '../http_client/types';
import * as ShopifyErrors from '../../error';
import {CreateClientClassParams} from '..';

import {GraphqlParams} from './types';

export interface AccessTokenHeader {
  header: string;
  value: string;
}

export interface GraphqlClientParams {
  domain: string;
  accessToken?: string;
}

export function createGraphqlClientClass(params: CreateClientClassParams) {
  const {config} = params;
  let {HttpClient} = params;
  if (!HttpClient) {
    HttpClient = createHttpClientClass(params.config);
  }
  return class GraphqlClient {
    baseApiPath = '/admin/api';
    readonly domain: string;
    readonly accessToken: string;
    readonly client;

    constructor({domain, accessToken}: GraphqlClientParams) {
      if (!config.isPrivateApp && !accessToken) {
        throw new ShopifyErrors.MissingRequiredArgument(
          'Missing access token when creating GraphQL client',
        );
      }

      this.domain = domain;
      if (accessToken) {
        this.accessToken = accessToken;
      }
      this.client = new HttpClient!({domain: this.domain});
    }

    async query<T = unknown>(params: GraphqlParams): Promise<RequestReturn<T>> {
      if (
        (typeof params.data === 'string' && params.data.length === 0) ||
        Object.entries(params.data).length === 0
      ) {
        throw new ShopifyErrors.MissingRequiredArgument('Query missing.');
      }

      const accessTokenHeader = this.getAccessTokenHeader();
      params.extraHeaders = {
        [accessTokenHeader.header]: accessTokenHeader.value,
        ...params.extraHeaders,
      };

      const path = `${this.baseApiPath}/${config.apiVersion}/graphql.json`;

      let dataType: DataType.GraphQL | DataType.JSON;

      if (typeof params.data === 'object') {
        dataType = DataType.JSON;
      } else {
        dataType = DataType.GraphQL;
      }

      const result = await this.client.post<T>({
        path,
        type: dataType,
        ...params,
      });

      if ((result.body as unknown as {[key: string]: unknown}).errors) {
        throw new ShopifyErrors.GraphqlQueryError({
          message: 'GraphQL query returned errors',
          response: result.body as unknown as {[key: string]: unknown},
        });
      }
      return result;
    }

    getAccessTokenHeader(): AccessTokenHeader {
      return {
        header: ShopifyHeader.AccessToken,
        value: config.isPrivateApp
          ? config.apiSecretKey
          : (this.accessToken as string),
      };
    }
  };
}
