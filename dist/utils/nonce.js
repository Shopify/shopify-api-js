"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var crypto_1 = tslib_1.__importDefault(require("crypto"));
function nonce() {
    var length = 15;
    var bytes = crypto_1.default.randomBytes(length);
    var nonce = bytes
        .map(function (byte) {
        return byte % 10;
    })
        .join('');
    return nonce;
}
exports.default = nonce;
