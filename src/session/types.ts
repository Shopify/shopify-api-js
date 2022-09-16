import {AuthScopes} from '../auth/scopes';
import {AdapterArgs, NormalizedRequest} from '../runtime/http';
import {OnlineAccessInfo} from '../auth/oauth/types';
import {createRestClientClass} from '../clients/rest/rest_client';
import {createGraphqlClientClass} from '../clients/graphql/graphql_client';
import {ClientType} from '../base-types';

import type {shopifySession} from '.';

export interface SessionParams {
  readonly id: string;
  shop: string;
  state: string;
  isOnline: boolean;
  scope?: string;
  expires?: Date;
  accessToken?: string;
  onlineAccessInfo?: OnlineAccessInfo;
}

export interface SessionInterface extends SessionParams {
  isActive(scopes: AuthScopes | string | string[]): boolean;
}

export interface JwtPayload {
  iss: string;
  dest: string;
  aud: string;
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  sid: string;
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

export interface WithSessionParams extends AdapterArgs {
  clientType: ClientType;
  isOnline: boolean;
}

interface WithSessionBaseResponse {
  session: SessionInterface;
}

export interface RestWithSession extends WithSessionBaseResponse {
  client: InstanceType<ReturnType<typeof createRestClientClass>>;
}

export interface GraphqlWithSession extends WithSessionBaseResponse {
  client: InstanceType<ReturnType<typeof createGraphqlClientClass>>;
}

export type WithSessionResponse = RestWithSession | GraphqlWithSession;

export type ShopifySession = ReturnType<typeof shopifySession>;
