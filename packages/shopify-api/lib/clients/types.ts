import {Session} from '../session/session';
import {FeatureEnabled, FutureFlagOptions} from '../../future/flags';
import {ApiVersion} from '../types';

import {GraphqlClient} from './legacy_graphql/legacy_admin_client';
import {StorefrontClient} from './legacy_graphql/legacy_storefront_client';
import {GraphqlProxy} from './graphql_proxy/types';
import {RestClient as RestClientClass} from './admin/rest/rest_client';
import {AdminClientFactory} from './admin/types';
import {StorefrontClientFactory} from './storefront/types';

export * from './http_client/types';
export * from './legacy_graphql/types';
export * from './admin/types';
export * from './storefront/types';

export interface ClientArgs {
  session: Session;
  apiVersion?: ApiVersion;
  retries?: number;
}

export type ShopifyClients<
  Future extends FutureFlagOptions = FutureFlagOptions,
> = FeatureEnabled<Future, 'unstable_newApiClients'> extends true
  ? {
      admin: {
        graphql: AdminClientFactory;
      };
      storefront: StorefrontClientFactory;
      graphqlProxy: GraphqlProxy;
    }
  : {
      Rest: typeof RestClientClass;
      Graphql: typeof GraphqlClient;
      Storefront: typeof StorefrontClient;
      graphqlProxy: GraphqlProxy;
    };
