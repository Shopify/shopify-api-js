import {CreateGraphqlClientClassParams} from '..';
import {ShopifyHeader} from '../../base-types';

import {AccessTokenHeader, GraphqlClient} from './graphql_client';

export class StorefrontClient extends GraphqlClient {
  baseApiPath = '/api';

  protected getAccessTokenHeader(): AccessTokenHeader {
    return {
      header: ShopifyHeader.StorefrontAccessToken,
      value: (this.storefrontClass().CONFIG.isPrivateApp
        ? this.storefrontClass().CONFIG.privateAppStorefrontAccessToken ||
          this.session.accessToken
        : this.session.accessToken) as string,
    };
  }

  private storefrontClass() {
    return this.constructor as typeof StorefrontClient;
  }
}

export function createStorefrontClientClass(
  params: CreateGraphqlClientClassParams,
) {
  class NewStorefrontClient extends StorefrontClient {
    public static CONFIG = params.config;
  }

  Reflect.defineProperty(NewStorefrontClient, 'name', {
    value: 'StorefrontClient',
  });

  return NewStorefrontClient as typeof StorefrontClient;
}
