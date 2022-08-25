import {config} from '../../config';
import {ShopifyHeader} from '../../base-types';

import {GraphqlClient, AccessTokenHeader} from './graphql_client';

export class StorefrontClient extends GraphqlClient {
  protected baseApiPath = '/api';

  protected getAccessTokenHeader(): AccessTokenHeader {
    return {
      header: ShopifyHeader.StorefrontAccessToken,
      value: (config.isPrivateApp
        ? config.privateAppStorefrontAccessToken || this.accessToken
        : this.accessToken) as string,
    };
  }
}
