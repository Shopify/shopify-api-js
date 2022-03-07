import {Context} from '../../context';
import {ShopifyHeader} from '../../base-types';

import {GraphqlClient, AccessTokenHeader} from './graphql_client';

export class StorefrontClient extends GraphqlClient {
  protected baseApiPath = '/api';

  protected getAccessTokenHeader(): AccessTokenHeader {
    return {
      header: ShopifyHeader.StorefrontAccessToken,
      value: (Context.IS_PRIVATE_APP
        ? Context.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN || this.accessToken
        : this.accessToken) as string,
    };
  }
}
