import {AdapterArgs} from '../runtime/http';
// import {SessionInterface} from '../session/types';
// import {createRestClientClass} from '../clients/rest/rest_client';
// import {createGraphqlClientClass} from '../clients/graphql/graphql_client';

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

export interface GetEmbeddedAppUrlParams extends AdapterArgs {}

// interface WithSessionBaseResponse {
//   session: SessionInterface;
// }

// export interface RestWithSession extends WithSessionBaseResponse {
//   client: InstanceType<ReturnType<typeof createRestClientClass>>;
// }

// export interface GraphqlWithSession extends WithSessionBaseResponse {
//   client: InstanceType<ReturnType<typeof createGraphqlClientClass>>;
// }

// export type WithSessionResponse = RestWithSession | GraphqlWithSession;

export type ShopifyUtils = ReturnType<typeof shopifyUtils>;
