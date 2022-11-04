import {CreateGraphqlClientClassParams} from '..';
import {ShopifyHeader} from '../../base-types';
import {createHttpClientClass} from '../http_client/http_client';

import {AccessTokenHeader, GraphqlClient} from './graphql_client';
import {StorefrontClientParams} from './types';

export class StorefrontClient extends GraphqlClient {
  baseApiPath = '/api';
  readonly storefrontAccessToken: string;

  constructor(params: StorefrontClientParams) {
    super({session: params.session});
    this.storefrontAccessToken = params.storefrontAccessToken;
  }

  protected getAccessTokenHeader(): AccessTokenHeader {
    return {
      header: ShopifyHeader.StorefrontAccessToken,
      value: (this.storefrontClass().CONFIG.isPrivateApp
        ? this.storefrontClass().CONFIG.privateAppStorefrontAccessToken ||
          this.storefrontAccessToken
        : this.storefrontAccessToken) as string,
    };
  }

  private storefrontClass() {
    return this.constructor as typeof StorefrontClient;
  }
}

export function createStorefrontClientClass(
  params: CreateGraphqlClientClassParams,
) {
  const {config} = params;
  let {HttpClient} = params;
  if (!HttpClient) {
    HttpClient = createHttpClientClass(config);
  }
  class NewStorefrontClient extends StorefrontClient {
    public static CONFIG = config;
    public static HTTP_CLIENT = HttpClient!;
  }

  Reflect.defineProperty(NewStorefrontClient, 'name', {
    value: 'StorefrontClient',
  });

  return NewStorefrontClient as typeof StorefrontClient;
}
