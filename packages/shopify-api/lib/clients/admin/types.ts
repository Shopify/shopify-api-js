import {SearchParams} from '@shopify/admin-api-client';

import {ApiVersion} from '../../types';
import {Session} from '../../session/session';
import {Headers} from '../../../runtime';

export interface PageInfoParams {
  path: string;
  query: SearchParams;
}

export interface PageInfo {
  limit: string;
  fields?: string[];
  previousPageUrl?: string;
  nextPageUrl?: string;
  prevPage?: PageInfoParams;
  nextPage?: PageInfoParams;
}

export interface RestRequestReturn<T = any> {
  body: T;
  headers: Headers;
  pageInfo?: PageInfo;
}

export interface RestClientParams {
  session: Session;
  apiVersion?: ApiVersion;
}
