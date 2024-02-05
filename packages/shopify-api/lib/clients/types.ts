import {
  AllOperations,
  ApiClientRequestOptions,
  SearchParams,
} from '@shopify/admin-api-client';
import {Method} from '@shopify/network';

import {Session} from '../session/session';
import type {ApiVersion} from '../types';
import {Headers} from '../../runtime/http';

import {GraphqlClient} from './admin/graphql/client';
import {StorefrontClient} from './storefront/client';
import type {GraphqlProxy} from './graphql_proxy/types';
import {RestClient} from './admin/rest/client';

export * from './admin/types';
export * from './graphql_proxy/types';

export interface ClientArgs {
  session: Session;
  apiVersion?: ApiVersion;
  retries?: number;
}

/**
 * Headers to be sent with the request.
 */
export type HeaderParams = Record<string, string | number | string[]>;

/* eslint-disable @shopify/typescript/prefer-pascal-case-enums */
export enum DataType {
  JSON = 'application/json',
  GraphQL = 'application/graphql',
  URLEncoded = 'application/x-www-form-urlencoded',
}
/* eslint-enable @shopify/typescript/prefer-pascal-case-enums */

export interface GetRequestParams {
  /**
   * The path to the resource, relative to the API version root.
   */
  path: string;
  /**
   * The type of data expected in the response.
   */
  type?: DataType;
  /**
   * The request body.
   */
  data?: Record<string, any> | string;
  /**
   * Query parameters to be sent with the request.
   */
  query?: SearchParams;
  /**
   * Additional headers to be sent with the request.
   */
  extraHeaders?: HeaderParams;
  /**
   * The maximum number of times the request can be made if it fails with a throttling or server error.
   */
  tries?: number;
}

export type PostRequestParams = GetRequestParams & {
  data: Record<string, any> | string;
};

export type PutRequestParams = PostRequestParams;

export type DeleteRequestParams = GetRequestParams;

export type RequestParams = (GetRequestParams | PostRequestParams) & {
  method: Method;
};

export interface RequestReturn<T = unknown> {
  /**
   * The response body.
   */
  body: T;
  /**
   * The response headers.
   */
  headers: Headers;
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
  /**
   * The variables to include in the operation.
   */
  variables?: ApiClientRequestOptions<Operation, Operations>['variables'];
  /**
   * Additional headers to be sent with the request.
   */
  headers?: Record<string, string | number>;
  /**
   * The maximum number of times to retry the request if it fails with a throttling or server error.
   */
  retries?: number;
}

export {GraphqlClient} from './admin/graphql/client';

export interface ShopifyClients {
  Rest: typeof RestClient;
  Graphql: typeof GraphqlClient;
  Storefront: typeof StorefrontClient;
  graphqlProxy: GraphqlProxy;
}
