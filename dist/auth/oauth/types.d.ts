export interface AuthQuery {
    code: string;
    timestamp: string;
    state: string;
    shop: string;
    host?: string;
    hmac?: string;
}
export interface AccessTokenResponse {
    access_token: string;
    scope: string;
}
export interface OnlineAccessInfo {
    expires_in: number;
    associated_user_scope: string;
    associated_user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        email_verified: boolean;
        account_owner: boolean;
        locale: string;
        collaborator: boolean;
    };
}
export interface OnlineAccessResponse extends AccessTokenResponse, OnlineAccessInfo {
}
//# sourceMappingURL=types.d.ts.map