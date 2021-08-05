import http from 'http';
import http2 from 'http2';

import {Session} from '../auth/session';
import {GraphqlClient} from '../clients/graphql';
import {RestClient} from '../clients/rest';

export interface WithSessionParams {
  clientType: 'rest' | 'graphql';
  isOnline: boolean;
  req?: http.IncomingMessage | http2.Http2ServerRequest;
  res?: http.ServerResponse | http2.Http2ServerResponse;
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
