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
  /**
   * How long the access token is valid for, in seconds.
   */
  expires_in: number;
  /**
   * The effective set of scopes for the session.
   */
  associated_user_scope: string;
  /**
   * The user associated with the access token.
   */
  associated_user: OnlineAccessUser;
}

export interface OnlineAccessUser {
  /**
   * The user's ID.
   */
  id: number;
  /**
   * The user's first name.
   */
  first_name: string;
  /**
   * The user's last name.
   */
  last_name: string;
  /**
   * The user's email address.
   */
  email: string;
  /**
   * Whether the user has verified their email address.
   */
  email_verified: boolean;
  /**
   * Whether the user is the account owner.
   */
  account_owner: boolean;
  /**
   * The user's locale.
   */
  locale: string;
  /**
   * Whether the user is a collaborator.
   */
  collaborator: boolean;
}

export interface OnlineAccessResponse
  extends AccessTokenResponse,
    OnlineAccessInfo {}
