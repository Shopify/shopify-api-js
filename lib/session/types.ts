import {AdapterArgs} from '../../runtime/http';
import {OnlineAccessInfo} from '../auth/oauth/types';
import {RestClient} from '../clients/rest/rest_client';
import {GraphqlClient} from '../clients/graphql/graphql_client';
import {ClientType} from '../types';

import {Session} from './session';

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

export interface GetCurrentSessionIdParams extends AdapterArgs {
  isOnline: boolean;
}

export interface WithSessionParams {
  session: Session;
  clientType: ClientType;
  isOnline: boolean;
}

interface WithSessionBaseResponse {
  session: Session;
}

export interface RestWithSession extends WithSessionBaseResponse {
  client: RestClient;
}

export interface GraphqlWithSession extends WithSessionBaseResponse {
  client: GraphqlClient;
}

export type WithSessionResponse = RestWithSession | GraphqlWithSession;
