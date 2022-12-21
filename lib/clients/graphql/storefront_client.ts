import {createStorefrontAPIClient} from '@shopify/storefront-api-js-client';

import {httpClientClass} from '../http_client/http_client';
import {Session} from '../../session/session';
import {HeaderParams} from '../http_client/types';

import {GraphqlClient, GraphqlClientClassParams} from './graphql_client';
import {StorefrontClientParams} from './types';

export class StorefrontClient extends GraphqlClient {
  baseApiPath = '/api';
  readonly domain: string;
  readonly storefrontAccessToken: string;

  private apiClient: ReturnType<typeof createStorefrontAPIClient>;

  constructor(params: StorefrontClientParams) {
    const session = new Session({
      shop: params.domain,
      id: '',
      state: '',
      isOnline: true,
      accessToken: params.storefrontAccessToken,
    });
    super({session});
    this.domain = params.domain;
    this.storefrontAccessToken = params.storefrontAccessToken;

    this.apiClient = createStorefrontAPIClient({
      storeUrl: params.domain,
      storefrontAPIAccessToken: params.storefrontAccessToken,
    });
  }

  protected getApiHeaders(): HeaderParams {
    return this.apiClient.getHeaders() as any;
  }

  // private storefrontClass() {
  //   return this.constructor as typeof StorefrontClient;
  // }
}

export function storefrontClientClass(params: GraphqlClientClassParams) {
  const {config} = params;
  let {HttpClient} = params;
  if (!HttpClient) {
    HttpClient = httpClientClass(config);
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
