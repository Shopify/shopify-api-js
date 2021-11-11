import { RequestReturn } from '../http_client/types';
import { GraphqlParams } from './types';
export interface AccessTokenHeader {
    header: string;
    value: string;
}
export declare class GraphqlClient {
    readonly domain: string;
    readonly accessToken?: string | undefined;
    protected baseApiPath: string;
    private readonly client;
    constructor(domain: string, accessToken?: string | undefined);
    query(params: GraphqlParams): Promise<RequestReturn>;
    protected getAccessTokenHeader(): AccessTokenHeader;
}
//# sourceMappingURL=graphql_client.d.ts.map