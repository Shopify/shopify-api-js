import {AuthScopes} from '../auth/scopes';
import {AdapterArgs, NormalizedRequest} from '../runtime/http';
import {OnlineAccessInfo} from '../auth/oauth/types';

import type {shopifySession} from '.';

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

export interface SessionGetCurrentParams extends AdapterArgs {
  isOnline: boolean;
}

export interface SessionDeleteCurrentParams extends AdapterArgs {
  isOnline: boolean;
}

export interface SessionGetOfflineParams {
  shop: string;
  includeExpired?: boolean;
}

export interface SessionDeleteOfflineParams {
  shop: string;
}

export interface GetCurrentSessionIdParams {
  request: NormalizedRequest;
  isOnline: boolean;
}

export type ShopifySession = ReturnType<typeof shopifySession>;
