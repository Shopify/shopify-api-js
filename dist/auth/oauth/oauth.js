"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyOAuth = void 0;
var tslib_1 = require("tslib");
var querystring_1 = tslib_1.__importDefault(require("querystring"));
var uuid_1 = require("uuid");
var cookies_1 = tslib_1.__importDefault(require("cookies"));
var context_1 = require("../../context");
var nonce_1 = tslib_1.__importDefault(require("../../utils/nonce"));
var hmac_validator_1 = tslib_1.__importDefault(require("../../utils/hmac-validator"));
var shop_validator_1 = tslib_1.__importDefault(require("../../utils/shop-validator"));
var safe_compare_1 = tslib_1.__importDefault(require("../../utils/safe-compare"));
var decode_session_token_1 = tslib_1.__importDefault(require("../../utils/decode-session-token"));
var session_1 = require("../session");
var http_client_1 = require("../../clients/http_client/http_client");
var types_1 = require("../../clients/http_client/types");
var ShopifyErrors = tslib_1.__importStar(require("../../error"));
var ShopifyOAuth = {
    SESSION_COOKIE_NAME: 'shopify_app_session',
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
    beginAuth: function (request, response, shop, redirectPath, isOnline) {
        if (isOnline === void 0) { isOnline = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cookies, state, session, sessionStored, query, queryString;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context_1.Context.throwIfUninitialized();
                        context_1.Context.throwIfPrivateApp('Cannot perform OAuth for private apps');
                        cookies = new cookies_1.default(request, response, {
                            keys: [context_1.Context.API_SECRET_KEY],
                            secure: true,
                        });
                        state = nonce_1.default();
                        session = new session_1.Session(isOnline ? uuid_1.v4() : this.getOfflineSessionId(shop), shop, state, isOnline);
                        return [4 /*yield*/, context_1.Context.SESSION_STORAGE.storeSession(session)];
                    case 1:
                        sessionStored = _a.sent();
                        if (!sessionStored) {
                            throw new ShopifyErrors.SessionStorageError('OAuth Session could not be saved. Please check your session storage functionality.');
                        }
                        cookies.set(ShopifyOAuth.SESSION_COOKIE_NAME, session.id, {
                            signed: true,
                            expires: new Date(Date.now() + 60000),
                            sameSite: 'lax',
                            secure: true,
                        });
                        query = {
                            client_id: context_1.Context.API_KEY,
                            scope: context_1.Context.SCOPES.toString(),
                            redirect_uri: "https://" + context_1.Context.HOST_NAME + redirectPath,
                            state: state,
                            'grant_options[]': isOnline ? 'per-user' : '',
                        };
                        queryString = querystring_1.default.stringify(query);
                        return [2 /*return*/, "https://" + shop + "/admin/oauth/authorize?" + queryString];
                }
            });
        });
    },
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
    validateAuthCallback: function (request, response, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var cookies, sessionCookie, currentSession, body, postParams, client, postResponse, responseBody, access_token, scope, rest, sessionExpiration, onlineInfo, jwtSessionId, jwtSession, sessionDeleted, responseBody, sessionStored;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        context_1.Context.throwIfUninitialized();
                        context_1.Context.throwIfPrivateApp('Cannot perform OAuth for private apps');
                        cookies = new cookies_1.default(request, response, {
                            keys: [context_1.Context.API_SECRET_KEY],
                            secure: true,
                        });
                        sessionCookie = this.getCookieSessionId(request, response);
                        if (!sessionCookie) {
                            throw new ShopifyErrors.CookieNotFound("Cannot complete OAuth process. Could not find an OAuth cookie for shop url: " + query.shop);
                        }
                        return [4 /*yield*/, context_1.Context.SESSION_STORAGE.loadSession(sessionCookie)];
                    case 1:
                        currentSession = _a.sent();
                        if (!currentSession) {
                            throw new ShopifyErrors.SessionNotFound("Cannot complete OAuth process. No session found for the specified shop url: " + query.shop);
                        }
                        if (!validQuery(query, currentSession)) {
                            throw new ShopifyErrors.InvalidOAuthError('Invalid OAuth callback.');
                        }
                        body = {
                            client_id: context_1.Context.API_KEY,
                            client_secret: context_1.Context.API_SECRET_KEY,
                            code: query.code,
                        };
                        postParams = {
                            path: '/admin/oauth/access_token',
                            type: types_1.DataType.JSON,
                            data: body,
                        };
                        client = new http_client_1.HttpClient(currentSession.shop);
                        return [4 /*yield*/, client.post(postParams)];
                    case 2:
                        postResponse = _a.sent();
                        if (!currentSession.isOnline) return [3 /*break*/, 5];
                        responseBody = postResponse.body;
                        access_token = responseBody.access_token, scope = responseBody.scope, rest = tslib_1.__rest(responseBody, ["access_token", "scope"]);
                        sessionExpiration = new Date(Date.now() + responseBody.expires_in * 1000);
                        currentSession.accessToken = access_token;
                        currentSession.expires = sessionExpiration;
                        currentSession.scope = scope;
                        currentSession.onlineAccessInfo = rest;
                        if (!context_1.Context.IS_EMBEDDED_APP) return [3 /*break*/, 4];
                        onlineInfo = currentSession.onlineAccessInfo;
                        jwtSessionId = this.getJwtSessionId(currentSession.shop, "" + onlineInfo.associated_user.id);
                        jwtSession = session_1.Session.cloneSession(currentSession, jwtSessionId);
                        return [4 /*yield*/, context_1.Context.SESSION_STORAGE.deleteSession(currentSession.id)];
                    case 3:
                        sessionDeleted = _a.sent();
                        if (!sessionDeleted) {
                            throw new ShopifyErrors.SessionStorageError('OAuth Session could not be deleted. Please check your session storage functionality.');
                        }
                        currentSession = jwtSession;
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        responseBody = postResponse.body;
                        currentSession.accessToken = responseBody.access_token;
                        currentSession.scope = responseBody.scope;
                        _a.label = 6;
                    case 6:
                        cookies.set(ShopifyOAuth.SESSION_COOKIE_NAME, currentSession.id, {
                            signed: true,
                            expires: context_1.Context.IS_EMBEDDED_APP ? new Date() : currentSession.expires,
                            sameSite: 'lax',
                            secure: true,
                        });
                        return [4 /*yield*/, context_1.Context.SESSION_STORAGE.storeSession(currentSession)];
                    case 7:
                        sessionStored = _a.sent();
                        if (!sessionStored) {
                            throw new ShopifyErrors.SessionStorageError('OAuth Session could not be saved. Please check your session storage functionality.');
                        }
                        return [2 /*return*/, currentSession];
                }
            });
        });
    },
    /**
     * Loads the current session id from the session cookie.
     *
     * @param request HTTP request object
     * @param response HTTP response object
     */
    getCookieSessionId: function (request, response) {
        var cookies = new cookies_1.default(request, response, {
            secure: true,
            keys: [context_1.Context.API_SECRET_KEY],
        });
        return cookies.get(this.SESSION_COOKIE_NAME, { signed: true });
    },
    /**
     * Builds a JWT session id from the current shop and user.
     *
     * @param shop Shopify shop domain
     * @param userId Current actor id
     */
    getJwtSessionId: function (shop, userId) {
        return shop + "_" + userId;
    },
    /**
     * Builds an offline session id for the given shop.
     *
     * @param shop Shopify shop domain
     */
    getOfflineSessionId: function (shop) {
        return "offline_" + shop;
    },
    /**
     * Extracts the current session id from the request / response pair.
     *
     * @param request  HTTP request object
     * @param response HTTP response object
     * @param isOnline Whether to load online (default) or offline sessions (optional)
     */
    getCurrentSessionId: function (request, response, isOnline) {
        if (isOnline === void 0) { isOnline = true; }
        var currentSessionId;
        if (context_1.Context.IS_EMBEDDED_APP) {
            var authHeader = request.headers.authorization;
            if (authHeader) {
                var matches = authHeader.match(/^Bearer (.+)$/);
                if (!matches) {
                    throw new ShopifyErrors.MissingJwtTokenError('Missing Bearer token in authorization header');
                }
                var jwtPayload = decode_session_token_1.default(matches[1]);
                var shop = jwtPayload.dest.replace(/^https:\/\//, '');
                if (isOnline) {
                    currentSessionId = this.getJwtSessionId(shop, jwtPayload.sub);
                }
                else {
                    currentSessionId = this.getOfflineSessionId(shop);
                }
            }
        }
        // Non-embedded apps will always load sessions using cookies. However, we fall back to the cookie session for
        // embedded apps to allow apps to load their skeleton page after OAuth, so they can set up App Bridge and get a new
        // JWT.
        if (!currentSessionId) {
            // We still want to get the offline session id from the cookie to make sure it's validated
            currentSessionId = this.getCookieSessionId(request, response);
        }
        return currentSessionId;
    },
};
exports.ShopifyOAuth = ShopifyOAuth;
/**
 * Uses the validation utils validateHmac, validateShop, and safeCompare to assess whether the callback is valid.
 *
 * @param query Current HTTP Request Query
 * @param session Current session
 */
function validQuery(query, session) {
    return (hmac_validator_1.default(query) &&
        shop_validator_1.default(query.shop) &&
        safe_compare_1.default(query.state, session.state));
}
