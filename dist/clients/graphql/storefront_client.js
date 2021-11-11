"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorefrontClient = void 0;
var tslib_1 = require("tslib");
var context_1 = require("../../context");
var base_types_1 = require("../../base_types");
var graphql_client_1 = require("./graphql_client");
var StorefrontClient = /** @class */ (function (_super) {
    tslib_1.__extends(StorefrontClient, _super);
    function StorefrontClient() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.baseApiPath = '/api';
        return _this;
    }
    StorefrontClient.prototype.getAccessTokenHeader = function () {
        return {
            header: base_types_1.ShopifyHeader.StorefrontAccessToken,
            value: (context_1.Context.IS_PRIVATE_APP
                ? context_1.Context.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN || this.accessToken
                : this.accessToken),
        };
    };
    return StorefrontClient;
}(graphql_client_1.GraphqlClient));
exports.StorefrontClient = StorefrontClient;
