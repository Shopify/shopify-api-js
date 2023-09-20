import {Method} from '@shopify/network';

import {Headers} from '../../../runtime/http';

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
