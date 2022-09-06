import http from 'http';

import {AdapterArgs} from '../runtime/http';

// eslint-disable-next-line no-warning-comments
// TODO: uncomment and fix issues once we've refactored the clients
// import {SessionInterface} from '../auth/session/types';
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

export interface GetEmbeddedAppUrlParams extends AdapterArgs {}

// interface WithSessionBaseResponse {
//   session: SessionInterface;
// }

// export interface RestWithSession extends WithSessionBaseResponse {
//   client: RestClient;
// }

// export interface GraphqlWithSession extends WithSessionBaseResponse {
//   client: GraphqlClient;
// }

// export type WithSessionResponse = RestWithSession | GraphqlWithSession;

export type ShopifyUtils = ReturnType<typeof shopifyUtils>;
