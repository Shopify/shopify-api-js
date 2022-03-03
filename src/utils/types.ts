import http from 'http';

import {Session} from '../auth/session';
import {GraphqlClient} from '../clients/graphql';

export interface WithSessionParams {
  clientType: 'graphql';
  isOnline: boolean;
  req?: http.IncomingMessage;
  res?: http.ServerResponse;
  shop?: string;
}

interface WithSessionBaseResponse {
  session: Session;
}

export interface GraphqlWithSession extends WithSessionBaseResponse {
  client: GraphqlClient;
}

export type WithSessionResponse = GraphqlWithSession;
