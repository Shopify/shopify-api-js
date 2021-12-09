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

export interface GetRequestParams {
  path: string;
  type?: DataType;
  data?: {[key: string]: unknown;} | string;
  query?: {[key: string]: string | number;};
  extraHeaders?: HeaderParams;
  tries?: number;
}

export type PostRequestParams = GetRequestParams & {
  type: DataType;
  data: {[key: string]: unknown;} | string;
};

export type PutRequestParams = PostRequestParams;

export type DeleteRequestParams = GetRequestParams;

export type RequestParams = (GetRequestParams | PostRequestParams) & {
  method: Method;
};

export interface RequestReturn {
  body: unknown;
  headers: Headers;
}
