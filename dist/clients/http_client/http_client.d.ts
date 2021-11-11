import { GetRequestParams, PostRequestParams, PutRequestParams, DeleteRequestParams, RequestParams, RequestReturn } from './types';
declare class HttpClient {
    private domain;
    static readonly RETRY_WAIT_TIME = 1000;
    static readonly DEPRECATION_ALERT_DELAY = 300000;
    private LOGGED_DEPRECATIONS;
    constructor(domain: string);
    /**
     * Performs a GET request on the given path.
     */
    get(params: GetRequestParams): Promise<RequestReturn>;
    /**
     * Performs a POST request on the given path.
     */
    post(params: PostRequestParams): Promise<RequestReturn>;
    /**
     * Performs a PUT request on the given path.
     */
    put(params: PutRequestParams): Promise<RequestReturn>;
    /**
     * Performs a DELETE request on the given path.
     */
    delete(params: DeleteRequestParams): Promise<RequestReturn>;
    protected request(params: RequestParams): Promise<RequestReturn>;
    private doRequest;
}
export { HttpClient };
//# sourceMappingURL=http_client.d.ts.map