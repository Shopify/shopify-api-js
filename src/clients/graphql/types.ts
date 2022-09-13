import {AdapterArgs} from '../../runtime/http';
import {PostRequestParams} from '../http_client/types';

export type GraphqlParams = Omit<PostRequestParams, 'path' | 'type'>;

export interface GraphqlProxyParams extends AdapterArgs {
  body: string;
}
