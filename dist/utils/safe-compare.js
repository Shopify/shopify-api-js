"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var crypto_1 = tslib_1.__importDefault(require("crypto"));
var ShopifyErrors = tslib_1.__importStar(require("../error"));
/**
 * A timing safe string comparison utility.
 *
 * @param strA any string, array of strings, or object with string values
 * @param strB any string, array of strings, or object with string values
 */
function safeCompare(strA, strB) {
    if (typeof strA === typeof strB) {
        var buffA = void 0;
        var buffB = void 0;
        if (typeof strA === 'object' && typeof strB === 'object') {
            buffA = Buffer.from(JSON.stringify(strA));
            buffB = Buffer.from(JSON.stringify(strB));
        }
        else {
            buffA = Buffer.from(strA);
            buffB = Buffer.from(strB);
        }
        if (buffA.length === buffB.length) {
            return crypto_1.default.timingSafeEqual(buffA, buffB);
        }
    }
    else {
        throw new ShopifyErrors.SafeCompareError("Mismatched data types provided: " + typeof strA + " and " + typeof strB);
    }
    return false;
}
exports.default = safeCompare;
