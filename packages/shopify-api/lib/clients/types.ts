import {
  AllOperations,
  ApiClientRequestOptions,
} from '@shopify/admin-api-client';

import {Session} from '../session/session';
import {ApiVersion} from '../types';

import {GraphqlClient} from './admin/graphql/client';
import {StorefrontClient} from './storefront/client';
import {GraphqlProxy} from './graphql_proxy/types';
import {RestClient} from './admin/rest/client';
import {PostRequestParams} from './http_client/types';

export * from './http_client/types';
export * from './admin/types';
export * from './graphql_proxy/types';

export interface ClientArgs {
  session: Session;
  apiVersion?: ApiVersion;
  retries?: number;
}

export type GraphqlParams = Omit<PostRequestParams, 'path' | 'type'>;

export interface GraphqlClientParams {
  session: Session;
  apiVersion?: ApiVersion;
}

export interface GraphqlQueryOptions<
  Operation extends keyof Operations,
  Operations extends AllOperations,
> {
  variables?: ApiClientRequestOptions<Operation, Operations>['variables'];
  extraHeaders?: Record<string, string | number>;
  tries?: number;
}

export interface ShopifyClients {
  Rest: typeof RestClient;
  Graphql: typeof GraphqlClient;
  Storefront: typeof StorefrontClient;
  graphqlProxy: GraphqlProxy;
}
