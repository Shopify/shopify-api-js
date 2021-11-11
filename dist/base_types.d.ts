import { AuthScopes } from './auth/scopes';
import { SessionStorage } from './auth/session/session_storage';
export interface ContextParams {
    API_KEY: string;
    API_SECRET_KEY: string;
    SCOPES: string[] | AuthScopes;
    HOST_NAME: string;
    API_VERSION: ApiVersion;
    IS_EMBEDDED_APP: boolean;
    IS_PRIVATE_APP?: boolean;
    SESSION_STORAGE?: SessionStorage;
    LOG_FILE?: string;
    USER_AGENT_PREFIX?: string;
    PRIVATE_APP_STOREFRONT_ACCESS_TOKEN?: string;
}
export declare enum ApiVersion {
    April19 = "2019-04",
    July19 = "2019-07",
    October19 = "2019-10",
    January20 = "2020-01",
    April20 = "2020-04",
    July20 = "2020-07",
    October20 = "2020-10",
    January21 = "2021-01",
    April21 = "2021-04",
    July21 = "2021-07",
    October21 = "2021-10",
    Unstable = "unstable",
    Unversioned = "unversioned"
}
export declare enum ShopifyHeader {
    AccessToken = "X-Shopify-Access-Token",
    StorefrontAccessToken = "X-Shopify-Storefront-Access-Token",
    Hmac = "X-Shopify-Hmac-Sha256",
    Topic = "X-Shopify-Topic",
    Domain = "X-Shopify-Shop-Domain"
}
//# sourceMappingURL=base_types.d.ts.map