import {} from '../../future/flags';

import {GraphqlClient} from './graphql/graphql_client';
import {StorefrontClient} from './graphql/storefront_client';
import {GraphqlProxy} from './graphql/types';
import {RestClient} from './rest/rest_client';

export * from './http_client/types';
export * from './rest/types';
export * from './graphql/types';

export interface ShopifyClients {
  Rest: typeof RestClient;
  Graphql: typeof GraphqlClient;
  Storefront: typeof StorefrontClient;
  graphqlProxy: GraphqlProxy;
}
