"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLocalHmac = exports.stringifyQuery = void 0;
var tslib_1 = require("tslib");
var crypto_1 = tslib_1.__importDefault(require("crypto"));
var querystring_1 = tslib_1.__importDefault(require("querystring"));
var ShopifyErrors = tslib_1.__importStar(require("../error"));
var context_1 = require("../context");
var safe_compare_1 = tslib_1.__importDefault(require("./safe-compare"));
function stringifyQuery(query) {
    var orderedObj = Object.keys(query)
        .sort(function (val1, val2) { return val1.localeCompare(val2); })
        .reduce(function (obj, key) {
        obj[key] = query[key];
        return obj;
    }, {});
    return querystring_1.default.stringify(orderedObj);
}
exports.stringifyQuery = stringifyQuery;
function generateLocalHmac(_a) {
    var code = _a.code, timestamp = _a.timestamp, state = _a.state, shop = _a.shop, host = _a.host;
    var queryString = stringifyQuery(tslib_1.__assign({ code: code,
        timestamp: timestamp,
        state: state,
        shop: shop }, host && { host: host }));
    return crypto_1.default
        .createHmac('sha256', context_1.Context.API_SECRET_KEY)
        .update(queryString)
        .digest('hex');
}
exports.generateLocalHmac = generateLocalHmac;
/**
 * Uses the received query to validate the contained hmac value against the rest of the query content.
 *
 * @param query HTTP Request Query, containing the information to be validated.
 */
function validateHmac(query) {
    if (!query.hmac) {
        throw new ShopifyErrors.InvalidHmacError('Query does not contain an HMAC value.');
    }
    var hmac = query.hmac;
    var localHmac = generateLocalHmac(query);
    return safe_compare_1.default(hmac, localHmac);
}
exports.default = validateHmac;
