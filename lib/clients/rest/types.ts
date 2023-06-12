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
