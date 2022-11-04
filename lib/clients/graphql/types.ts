import {Session} from '../../session/session';
import {PostRequestParams} from '../http_client/types';

export type GraphqlParams = Omit<PostRequestParams, 'path' | 'type'>;

export interface GraphqlClientParams {
  session: Session;
}

export interface StorefrontClientParams extends GraphqlClientParams {
  storefrontAccessToken: string;
}

export interface GraphqlProxyParams {
  session: Session;
  rawBody: string;
}
