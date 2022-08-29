import {OnlineAccessInfo} from '../oauth/types';
import {AuthScopes} from '../scopes';

export interface SessionInterface {
  readonly id: string;
  shop: string;
  state: string;
  isOnline: boolean;
  scope?: string;
  expires?: Date;
  accessToken?: string;
  onlineAccessInfo?: OnlineAccessInfo;
  isActive(scopes: AuthScopes | string | string[]): boolean;
}
