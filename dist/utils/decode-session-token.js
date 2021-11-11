"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSessionToken = void 0;
var tslib_1 = require("tslib");
var jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
var context_1 = require("../context");
var ShopifyErrors = tslib_1.__importStar(require("../error"));
var shop_validator_1 = tslib_1.__importDefault(require("./shop-validator"));
var JWT_PERMITTED_CLOCK_TOLERANCE = 5;
/**
 * Decodes the given session token, and extracts the session information from it
 *
 * @param token Received session token
 */
function decodeSessionToken(token) {
    var payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, context_1.Context.API_SECRET_KEY, {
            algorithms: ['HS256'],
            clockTolerance: JWT_PERMITTED_CLOCK_TOLERANCE,
        });
    }
    catch (error) {
        throw new ShopifyErrors.InvalidJwtError("Failed to parse session token '" + token + "': " + error.message);
    }
    // The exp and nbf fields are validated by the JWT library
    if (payload.aud !== context_1.Context.API_KEY) {
        throw new ShopifyErrors.InvalidJwtError('Session token had invalid API key');
    }
    if (!shop_validator_1.default(payload.dest.replace(/^https:\/\//, ''))) {
        throw new ShopifyErrors.InvalidJwtError('Session token had invalid shop');
    }
    return payload;
}
exports.decodeSessionToken = decodeSessionToken;
exports.default = decodeSessionToken;
