import {ApiVersion} from '../../types';
import {Session} from '../../session/session';
import {PostRequestParams} from '../http_client/types';

export type GraphqlParams = Omit<PostRequestParams, 'path' | 'type'>;

export interface GraphqlClientParams {
  session: Session;
  apiVersion?: ApiVersion;
}

export interface DeprecatedStorefrontClientParams {
  domain: string;
  storefrontAccessToken: string;
  apiVersion?: ApiVersion;
}

export interface GraphqlProxyParams {
  session: Session;
  rawBody: string;
}
