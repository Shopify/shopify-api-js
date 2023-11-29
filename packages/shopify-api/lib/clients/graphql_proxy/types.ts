import {Session} from '../../session/session';
import {RequestReturn} from '../http_client/types';

export interface GraphqlProxyParams {
  session: Session;
  rawBody: string | {[key: string]: any};
}

export type GraphqlProxy = (
  params: GraphqlProxyParams,
) => Promise<RequestReturn>;
