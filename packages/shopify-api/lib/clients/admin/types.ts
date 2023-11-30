import {createAdminApiClient} from '@shopify/admin-api-client';

import type {ClientArgs, HeaderParams} from '../types';
import {ApiVersion} from '../../types';
import {Session} from '../../session/session';
import {RequestReturn, QueryParams} from '../http_client/types';

export interface PageInfoParams {
  path: string;
  query: {[key: string]: QueryParams};
}

export interface PageInfo {
  limit: string;
  fields?: string[];
  previousPageUrl?: string;
  nextPageUrl?: string;
  prevPage?: PageInfoParams;
  nextPage?: PageInfoParams;
}

export type RestRequestReturn<T = unknown> = RequestReturn<T> & {
  pageInfo?: PageInfo;
};

export interface RestClientParams {
  session: Session;
  apiVersion?: ApiVersion;
}

export type AdminGraphqlClient = ReturnType<typeof createAdminApiClient>;

export type AdminGraphqlClientFactory = (
  args: ClientArgs,
) => AdminGraphqlClient;

interface RestRequestOptions {
  data?: {[key: string]: unknown} | string;
  query?: {[key: string]: QueryParams};
  headers?: HeaderParams;
  tries?: number;
}
interface RestRequestOptionsWithData extends RestRequestOptions {
  data: NonNullable<RestRequestOptions['data']>;
}

export interface AdminRestClient {
  get: <T = unknown>(
    path: string,
    params?: RestRequestOptions,
  ) => Promise<RestRequestReturn<T>>;
  post: <T = unknown>(
    path: string,
    params: RestRequestOptionsWithData,
  ) => Promise<RestRequestReturn<T>>;
  put: <T = unknown>(
    path: string,
    params: RestRequestOptionsWithData,
  ) => Promise<RestRequestReturn<T>>;
  delete: <T = unknown>(
    path: string,
    params?: RestRequestOptions,
  ) => Promise<RestRequestReturn<T>>;
}

export type AdminRestClientFactory = (
  params: RestClientParams,
) => AdminRestClient;
