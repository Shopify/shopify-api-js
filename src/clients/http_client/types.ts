import {Method} from '@shopify/network';
import {Headers} from 'node-fetch';

export interface HeaderParams {
  [key: string]: string | number;
}

export enum DataType {
  JSON = 'application/json', // eslint-disable-line @shopify/typescript/prefer-pascal-case-enums
  GraphQL = 'application/graphql', // eslint-disable-line @shopify/typescript/prefer-pascal-case-enums
  URLEncoded = 'application/x-www-form-urlencoded', // eslint-disable-line @shopify/typescript/prefer-pascal-case-enums
}

export type QueryParams =
  | string
  | number
  | string[]
  | number[]
  | {[key: string]: QueryParams};

export interface GetRequestParams {
  path: string;
  type?: DataType;
  data?: {[key: string]: unknown} | string;
  query?: {[key: string]: QueryParams};
  extraHeaders?: HeaderParams;
  tries?: number;
}

export type PostRequestParams = GetRequestParams & {
  type: DataType;
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
