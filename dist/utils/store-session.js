"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var context_1 = require("../context");
/**
 * Stores the current user's session.
 *
 * @param Session Session object
 */
function storeSession(session) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            context_1.Context.throwIfUninitialized();
            return [2 /*return*/, context_1.Context.SESSION_STORAGE.storeSession(session)];
        });
    });
}
exports.default = storeSession;
