import { Method } from '@shopify/network';
import { Headers } from 'node-fetch';
export declare type HeaderParams = Record<string, string | number>;
export declare enum DataType {
    JSON = "application/json",
    GraphQL = "application/graphql",
    URLEncoded = "application/x-www-form-urlencoded"
}
export interface GetRequestParams {
    path: string;
    type?: DataType;
    data?: Record<string, unknown> | string;
    query?: Record<string, string | number>;
    extraHeaders?: HeaderParams;
    tries?: number;
}
export declare type PostRequestParams = GetRequestParams & {
    type: DataType;
    data: Record<string, unknown> | string;
};
export declare type PutRequestParams = PostRequestParams;
export declare type DeleteRequestParams = GetRequestParams;
export declare type RequestParams = (GetRequestParams | PostRequestParams) & {
    method: Method;
};
export interface RequestReturn {
    body: unknown;
    headers: Headers;
}
//# sourceMappingURL=types.d.ts.map