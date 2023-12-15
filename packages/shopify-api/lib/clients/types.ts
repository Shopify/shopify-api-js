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

export interface HeaderParams {
  [key: string]: string | number | string[];
}

/* eslint-disable @shopify/typescript/prefer-pascal-case-enums */
export enum DataType {
  JSON = 'application/json',
  GraphQL = 'application/graphql',
  URLEncoded = 'application/x-www-form-urlencoded',
}
/* eslint-enable @shopify/typescript/prefer-pascal-case-enums */

export interface GetRequestParams {
  path: string;
  type?: DataType;
  data?: {[key: string]: unknown} | string;
  query?: SearchParams;
  extraHeaders?: HeaderParams;
  tries?: number;
}

export type PostRequestParams = GetRequestParams & {
  data: {[key: string]: unknown} | string;
};

export type PutRequestParams = PostRequestParams;

export type DeleteRequestParams = GetRequestParams;

export type RequestParams = (GetRequestParams | PostRequestParams) & {
  method: Method;
};

export interface RequestReturn<T = unknown> {
  body: T;
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
  variables?: ApiClientRequestOptions<Operation, Operations>['variables'];
  headers?: Record<string, string | number>;
  retries?: number;
}

export interface ShopifyClients {
  Rest: typeof RestClient;
  Graphql: typeof GraphqlClient;
  Storefront: typeof StorefrontClient;
  graphqlProxy: GraphqlProxy;
}
