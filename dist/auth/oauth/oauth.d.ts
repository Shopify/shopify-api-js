import http from 'http';
import { SessionInterface } from '../session/types';
import { AuthQuery } from './types';
declare const ShopifyOAuth: {
    SESSION_COOKIE_NAME: string;
    /**
     * Initializes a session and cookie for the OAuth process, and returns the necessary authorization url.
     *
     * @param request Current HTTP Request
     * @param response Current HTTP Response
     * @param shop Shop url: {shop}.myshopify.com
     * @param redirect Redirect url for callback
     * @param isOnline Boolean value. If true, appends 'per-user' grant options to authorization url to receive online access token.
     *                 During final oauth request, will receive back the online access token and current online session information.
     *                 Defaults to online access.
     */
    beginAuth(request: http.IncomingMessage, response: http.ServerResponse, shop: string, redirectPath: string, isOnline?: boolean): Promise<string>;
    /**
     * Validates the received callback query.
     * If valid, will make the subsequent request to update the current session with the appropriate access token.
     * Throws errors for missing sessions and invalid callbacks.
     *
     * @param request Current HTTP Request
     * @param response Current HTTP Response
     * @param query Current HTTP Request Query, containing the information to be validated.
     *              Depending on framework, this may need to be cast as "unknown" before being passed.
     * @returns SessionInterface
     */
    validateAuthCallback(request: http.IncomingMessage, response: http.ServerResponse, query: AuthQuery): Promise<SessionInterface>;
    /**
     * Loads the current session id from the session cookie.
     *
     * @param request HTTP request object
     * @param response HTTP response object
     */
    getCookieSessionId(request: http.IncomingMessage, response: http.ServerResponse): string | undefined;
    /**
     * Builds a JWT session id from the current shop and user.
     *
     * @param shop Shopify shop domain
     * @param userId Current actor id
     */
    getJwtSessionId(shop: string, userId: string): string;
    /**
     * Builds an offline session id for the given shop.
     *
     * @param shop Shopify shop domain
     */
    getOfflineSessionId(shop: string): string;
    /**
     * Extracts the current session id from the request / response pair.
     *
     * @param request  HTTP request object
     * @param response HTTP response object
     * @param isOnline Whether to load online (default) or offline sessions (optional)
     */
    getCurrentSessionId(request: http.IncomingMessage, response: http.ServerResponse, isOnline?: boolean): string | undefined;
};
export { ShopifyOAuth };
//# sourceMappingURL=oauth.d.ts.map