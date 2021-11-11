"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var context_1 = require("../context");
var oauth_1 = tslib_1.__importDefault(require("../auth/oauth"));
/**
 * Helper method to find and delete offline sessions by shop url.
 *
 * @param shop the shop url to find and delete a session for
 */
function deleteOfflineSession(shop) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var sessionId;
        return tslib_1.__generator(this, function (_a) {
            context_1.Context.throwIfUninitialized();
            sessionId = oauth_1.default.getOfflineSessionId(shop);
            return [2 /*return*/, context_1.Context.SESSION_STORAGE.deleteSession(sessionId)];
        });
    });
}
exports.default = deleteOfflineSession;
