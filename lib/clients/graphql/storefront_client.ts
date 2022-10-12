import {CreateClientClassParams} from '..';
import {ShopifyHeader} from '../../base-types';

import {createGraphqlClientClass, AccessTokenHeader} from './graphql_client';

export function createStorefrontClientClass(params: CreateClientClassParams) {
  const GraphqlClient = createGraphqlClientClass(params);

  return class StorefrontClient extends GraphqlClient {
    baseApiPath = '/api';

    getAccessTokenHeader(): AccessTokenHeader {
      return {
        header: ShopifyHeader.StorefrontAccessToken,
        value: (params.config.isPrivateApp
          ? params.config.privateAppStorefrontAccessToken || this.accessToken
          : this.accessToken) as string,
      };
    }
  };
}
