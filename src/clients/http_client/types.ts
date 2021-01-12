import {Method} from '@shopify/network';
import {Headers} from 'node-fetch';

export type HeaderParams = Record<string, string | number>;

export enum DataType {
  JSON = 'application/json',
  GraphQL = 'application/graphql',
  URLEncoded = 'application/x-www-form-urlencoded'
}

export interface GetRequestParams {
  path: string;
  type?: DataType;
  data?: Record<string, unknown> | string;
  query?: Record<string, string | number>;
  extraHeaders?: HeaderParams;
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
