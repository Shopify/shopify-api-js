import http from 'http';

import {GraphqlClient} from '../clients/graphql';

export interface WithSessionParams {
  clientType: 'graphql';
  isOnline: boolean;
  req?: http.IncomingMessage;
  res?: http.ServerResponse;
  shop?: string;
}

interface WithSessionBaseResponse {
}

export interface GraphqlWithSession extends WithSessionBaseResponse {
  client: GraphqlClient;
}

export type WithSessionResponse = GraphqlWithSession;
