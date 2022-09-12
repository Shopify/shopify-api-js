import {Session} from '../../session/session';
import {AdapterArgs, AdapterHeaders} from '../../runtime/http/types';

export interface AuthQuery {
  code: string;
  timestamp: string;
  state: string;
  shop: string;
  host?: string;
  hmac?: string;
}

export interface BeginParams extends AdapterArgs {
  shop: string;
  callbackPath: string;
  isOnline: boolean;
}

export interface CallbackParams extends AdapterArgs {
  query: AuthQuery;
  isOnline: boolean;
}

export interface CallbackResponse<T = AdapterHeaders> {
  headers: T;
  session: Session;
}

export interface AccessTokenResponse {
  access_token: string;
  scope: string;
}

export interface OnlineAccessInfo {
  expires_in: number;
  associated_user_scope: string;
  associated_user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified: boolean;
    account_owner: boolean;
    locale: string;
    collaborator: boolean;
  };
}

export interface OnlineAccessResponse
  extends AccessTokenResponse,
    OnlineAccessInfo {}
