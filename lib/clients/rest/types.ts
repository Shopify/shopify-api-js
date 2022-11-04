import {Session} from '../../session/session';
import {RequestReturn, GetRequestParams} from '../http_client/types';

export interface PageInfo {
  limit: string;
  fields?: string[];
  previousPageUrl?: string;
  nextPageUrl?: string;
  prevPage?: GetRequestParams;
  nextPage?: GetRequestParams;
}

export type RestRequestReturn<T = unknown> = RequestReturn<T> & {
  pageInfo?: PageInfo;
};

export interface RestClientParams {
  session: Session;
}
