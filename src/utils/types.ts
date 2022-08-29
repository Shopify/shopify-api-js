import http from 'http';

import {Session} from '../auth/session';
// import {GraphqlClient} from '../clients/graphql';
// import {RestClient} from '../clients/rest';

import type {shopifyUtils} from '.';

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

export interface WithSessionParams {
  clientType: 'rest' | 'graphql';
  isOnline: boolean;
  req?: http.IncomingMessage;
  res?: http.ServerResponse;
  shop?: string;
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

export type ShopifyUtils = ReturnType<typeof shopifyUtils>;
