import { HttpClient } from '../http_client/http_client';
import { RequestParams } from '../http_client/types';
import { RestRequestReturn } from './types';
declare class RestClient extends HttpClient {
    readonly accessToken?: string | undefined;
    private static LINK_HEADER_REGEXP;
    private static DEFAULT_LIMIT;
    constructor(domain: string, accessToken?: string | undefined);
    protected request(params: RequestParams): Promise<RestRequestReturn>;
    private getRestPath;
    private buildRequestParams;
}
export { RestClient };
//# sourceMappingURL=rest_client.d.ts.map