import type {PostRequestParams, RequestData, RequestReturn} from '../types';

import type {ReturnBody} from './types';

export interface AdminQueries {
  [key: string]: {return: any; variables?: any};
}

export interface AdminMutations {
  [key: string]: {return: any; variables?: any};
}

export type AdminOperations = AdminQueries & AdminMutations;

export type AdminGraphqlReturn<T = any> = Omit<RequestReturn<T>, 'body'> & {
  body: ReturnBody<T, AdminOperations>;
};

export type AdminGraphqlParams<T = any> = Omit<
  PostRequestParams,
  'path' | 'type' | 'data'
> & {
  data: RequestData<T, AdminOperations>;
};
