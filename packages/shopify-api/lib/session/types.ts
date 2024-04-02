import {AdapterArgs} from '../../runtime/http';
import {OnlineAccessInfo, OnlineAccessUser} from '../auth/oauth/types';

export interface SessionParams {
  /**
   * The unique identifier for the session.
   */
  readonly id: string;
  /**
   * The Shopify shop domain.
   */
  shop: string;
  /**
   * The state of the session. Used for the OAuth authentication code flow.
   */
  state: string;
  /**
   * Whether the access token in the session is online or offline.
   */
  isOnline: boolean;
  /**
   * The scopes for the access token.
   */
  scope?: string;
  /**
   * The date the access token expires.
   */
  expires?: Date;
  /**
   * The access token for the session.
   */
  accessToken?: string;
  /**
   * Information on the user for the session. Only present for online sessions.
   */
  onlineAccessInfo?: OnlineAccessInfo | StoredOnlineAccessInfo;
  /**
   * Additional properties of the session allowing for extension
   */
  [key: string]: any;
}

type StoredOnlineAccessInfo = Omit<OnlineAccessInfo, 'associated_user'> & {
  associated_user: Partial<OnlineAccessUser>;
};

export interface JwtPayload {
  /**
   * The shop's admin domain.
   */
  iss: string;
  /**
   * The shop's domain.
   */
  dest: string;
  /**
   * The client ID of the receiving app.
   */
  aud: string;
  /**
   * The User that the session token is intended for.
   */
  sub: string;
  /**
   * When the session token expires.
   */
  exp: number;
  /**
   * When the session token activates.
   */
  nbf: number;
  /**
   * When the session token was issued.
   */
  iat: number;
  /**
   * A secure random UUID.
   */
  jti: string;
  /**
   * A unique session ID per user and app.
   */
  sid: string;
}

export interface GetCurrentSessionIdParams extends AdapterArgs {
  isOnline: boolean;
}
