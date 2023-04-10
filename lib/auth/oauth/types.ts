import {AdapterArgs} from '../../../runtime/http/types';

export const SESSION_COOKIE_NAME = 'shopify_app_session';
export const STATE_COOKIE_NAME = 'shopify_app_state';

export interface AuthQuery {
  [key: string]: string | undefined;
  hmac?: string;
  signature?: string;
}

export interface BeginParams extends AdapterArgs {
  shop: string;
  callbackPath: string;
  isOnline: boolean;
}

export interface CallbackParams extends AdapterArgs {}

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
