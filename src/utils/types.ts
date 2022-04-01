import {Request, Response} from '../runtime/http';
import {Session} from '../auth/session';
import {GraphqlClient} from '../clients/graphql';
import {RestClient} from '../clients/rest';

export interface WithSessionParams {
  clientType: 'rest' | 'graphql';
  isOnline: boolean;
  req?: Request;
  res?: Response;
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
