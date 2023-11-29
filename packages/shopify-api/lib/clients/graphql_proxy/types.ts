import {Session} from '../../session/session';
import {RequestReturn} from '../http_client/types';

export interface GraphqlProxyParams {
  session: Session;
  rawBody: string;
}

export type GraphqlProxy = (
  params: GraphqlProxyParams,
) => Promise<RequestReturn>;
