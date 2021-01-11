import {PostRequestParams} from '../http_client';

export type GraphqlParams = Omit<PostRequestParams, 'path' | 'type'>;
