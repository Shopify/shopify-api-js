import {OnlineAccessInfo} from '../oauth/types';

export interface SessionInterface {
  readonly id: string;
  shop: string;
  state: string;
  scope: string;
  expires?: Date;
  isOnline?: boolean;
  accessToken?: string;
  onlineAccessInfo?: OnlineAccessInfo;
  isActive(): boolean;
}
