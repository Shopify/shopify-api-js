/// <reference types="node" />
import http from 'http';
import { Session } from '../auth/session';
import { GraphqlClient } from '../clients/graphql';
import { RestClient } from '../clients/rest';
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
export declare type WithSessionResponse = RestWithSession | GraphqlWithSession;
export {};
//# sourceMappingURL=types.d.ts.map