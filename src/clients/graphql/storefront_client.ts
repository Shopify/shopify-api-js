import {ShopifyHeader, ConfigInterface} from '../../base-types';

import {createGraphqlClientClass, AccessTokenHeader} from './graphql_client';

export function createStorefrontClientClass(config: ConfigInterface) {
  const GraphqlClient = createGraphqlClientClass(config);

  return class StorefrontClient extends GraphqlClient {
    baseApiPath = '/api';

    getAccessTokenHeader(): AccessTokenHeader {
      return {
        header: ShopifyHeader.StorefrontAccessToken,
        value: (config.isPrivateApp
          ? config.privateAppStorefrontAccessToken || this.accessToken
          : this.accessToken) as string,
      };
    }
  };
}
