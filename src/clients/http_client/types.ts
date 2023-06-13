import type {Method} from '@shopify/network';

<<<<<<< HEAD
<<<<<<< HEAD
export type HeaderParams = Record<string, string | number>;
=======
import type {Headers} from '../../adapters/abstract-http';
>>>>>>> origin/isomorphic/crypto
=======
import type {Headers} from '../../runtime/http';
>>>>>>> origin/isomorphic/main

export enum DataType {
  JSON = 'application/json',
  GraphQL = 'application/graphql',
  URLEncoded = 'application/x-www-form-urlencoded'
}

export interface GetRequestParams {
  path: string;
  type?: DataType;
<<<<<<< HEAD
  data?: Record<string, unknown> | string;
  query?: Record<string, string | number>;
  extraHeaders?: HeaderParams;
=======
  data?: {[key: string]: unknown} | string;
  query?: {[key: string]: QueryParams};
  extraHeaders?: Headers;
>>>>>>> origin/isomorphic/crypto
  tries?: number;
}

export type PostRequestParams = GetRequestParams & {
  type: DataType;
  data: Record<string, unknown> | string;
};

export type PutRequestParams = PostRequestParams;

export type DeleteRequestParams = GetRequestParams;

export type RequestParams = (GetRequestParams | PostRequestParams) & { method: Method; };

export interface RequestReturn {
  body: unknown;
  headers: Headers;
}
