"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemorySessionStorage = void 0;
var tslib_1 = require("tslib");
var MemorySessionStorage = /** @class */ (function () {
    function MemorySessionStorage() {
        this.sessions = {};
    }
    MemorySessionStorage.prototype.storeSession = function (session) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.sessions[session.id] = session;
                return [2 /*return*/, true];
            });
        });
    };
    MemorySessionStorage.prototype.loadSession = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.sessions[id] || undefined];
            });
        });
    };
    MemorySessionStorage.prototype.deleteSession = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (this.sessions[id]) {
                    delete this.sessions[id];
                }
                return [2 /*return*/, true];
            });
        });
    };
    return MemorySessionStorage;
}());
exports.MemorySessionStorage = MemorySessionStorage;
