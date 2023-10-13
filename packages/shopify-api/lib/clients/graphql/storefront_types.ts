import type {PostRequestParams, RequestData, RequestReturn} from '../types';

import type {ReturnBody} from './types';

export interface StorefrontQueries {
  [key: string]: {return: any; variables?: any};
}

export interface StorefrontMutations {
  [key: string]: {return: any; variables?: any};
}

export type StorefrontOperations = StorefrontQueries & StorefrontMutations;

export type StorefrontGraphqlReturn<T = any> = Omit<
  RequestReturn<T>,
  'body'
> & {
  body: ReturnBody<T, StorefrontOperations>;
};

export type StorefrontGraphqlParams<T = any> = Omit<
  PostRequestParams,
  'path' | 'type' | 'data'
> & {
  data: RequestData<T, StorefrontOperations>;
};
