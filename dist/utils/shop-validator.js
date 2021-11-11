"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validates myshopify.com urls
 *
 * @param shop Shop url: {shop}.myshopify.com
 */
function validateShop(shop) {
    var shopUrlRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.(com|io)[/]*$/;
    return shopUrlRegex.test(shop);
}
exports.default = validateShop;
