"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ShopifyErrors = tslib_1.__importStar(require("../error"));
var graphql_1 = require("../clients/graphql");
var rest_1 = require("../clients/rest");
var context_1 = require("../context");
var load_offline_session_1 = tslib_1.__importDefault(require("./load-offline-session"));
var load_current_session_1 = tslib_1.__importDefault(require("./load-current-session"));
function withSession(_a) {
    var clientType = _a.clientType, isOnline = _a.isOnline, req = _a.req, res = _a.res, shop = _a.shop;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var session, client;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    context_1.Context.throwIfUninitialized();
                    if (!isOnline) return [3 /*break*/, 2];
                    if (!req || !res) {
                        throw new ShopifyErrors.MissingRequiredArgument('Please pass in both the "request" and "response" objects.');
                    }
                    return [4 /*yield*/, load_current_session_1.default(req, res)];
                case 1:
                    session = _b.sent();
                    return [3 /*break*/, 4];
                case 2:
                    if (!shop) {
                        throw new ShopifyErrors.MissingRequiredArgument('Please pass in a value for "shop"');
                    }
                    return [4 /*yield*/, load_offline_session_1.default(shop)];
                case 3:
                    session = _b.sent();
                    _b.label = 4;
                case 4:
                    if (!session) {
                        throw new ShopifyErrors.SessionNotFound('No session found.');
                    }
                    else if (!session.accessToken) {
                        throw new ShopifyErrors.InvalidSession('Requested session does not contain an accessToken.');
                    }
                    switch (clientType) {
                        case 'rest':
                            client = new rest_1.RestClient(session.shop, session.accessToken);
                            return [2 /*return*/, {
                                    client: client,
                                    session: session,
                                }];
                        case 'graphql':
                            client = new graphql_1.GraphqlClient(session.shop, session.accessToken);
                            return [2 /*return*/, {
                                    client: client,
                                    session: session,
                                }];
                        default:
                            throw new ShopifyErrors.UnsupportedClientType("\"" + clientType + "\" is an unsupported clientType. Please use \"rest\" or \"graphql\".");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = withSession;
