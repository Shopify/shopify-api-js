import {AdapterArgs} from '../../../runtime/http/types';

export const SESSION_COOKIE_NAME = 'shopify_app_session';
export const STATE_COOKIE_NAME = 'shopify_app_state';

export interface AuthQuery {
  [key: string]: string | undefined;
  hmac?: string;
}

export interface BeginParams extends AdapterArgs {
  /** A Shopify domain name in the form `{exampleshop}.myshopify.com`. */
  shop: string;
  /** The path to the callback endpoint, with a leading `/`. This URL must be allowed in the Partners dashboard, or using the CLI to run your app. */
  callbackPath: string;
  /** `true` if the session is online and `false` otherwise. Learn more about [OAuth access modes](https://shopify.dev/docs/apps/auth/oauth/access-modes). */
  isOnline: boolean;
}

export interface CallbackParams extends AdapterArgs {
  /** Deprecated as of `v6.0.1`. Session type is automatically detected from response. */
  isOnline?: boolean;
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
