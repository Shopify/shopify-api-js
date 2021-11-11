"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyHeader = exports.ApiVersion = void 0;
var ApiVersion;
(function (ApiVersion) {
    ApiVersion["April19"] = "2019-04";
    ApiVersion["July19"] = "2019-07";
    ApiVersion["October19"] = "2019-10";
    ApiVersion["January20"] = "2020-01";
    ApiVersion["April20"] = "2020-04";
    ApiVersion["July20"] = "2020-07";
    ApiVersion["October20"] = "2020-10";
    ApiVersion["January21"] = "2021-01";
    ApiVersion["April21"] = "2021-04";
    ApiVersion["July21"] = "2021-07";
    ApiVersion["October21"] = "2021-10";
    ApiVersion["Unstable"] = "unstable";
    ApiVersion["Unversioned"] = "unversioned";
})(ApiVersion = exports.ApiVersion || (exports.ApiVersion = {}));
var ShopifyHeader;
(function (ShopifyHeader) {
    ShopifyHeader["AccessToken"] = "X-Shopify-Access-Token";
    ShopifyHeader["StorefrontAccessToken"] = "X-Shopify-Storefront-Access-Token";
    ShopifyHeader["Hmac"] = "X-Shopify-Hmac-Sha256";
    ShopifyHeader["Topic"] = "X-Shopify-Topic";
    ShopifyHeader["Domain"] = "X-Shopify-Shop-Domain";
})(ShopifyHeader = exports.ShopifyHeader || (exports.ShopifyHeader = {}));
