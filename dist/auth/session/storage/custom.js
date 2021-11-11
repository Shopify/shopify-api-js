"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSessionStorage = void 0;
var tslib_1 = require("tslib");
var session_1 = require("../session");
var ShopifyErrors = tslib_1.__importStar(require("../../../error"));
var CustomSessionStorage = /** @class */ (function () {
    function CustomSessionStorage(storeCallback, loadCallback, deleteCallback) {
        this.storeCallback = storeCallback;
        this.loadCallback = loadCallback;
        this.deleteCallback = deleteCallback;
        this.storeCallback = storeCallback;
        this.loadCallback = loadCallback;
        this.deleteCallback = deleteCallback;
    }
    CustomSessionStorage.prototype.storeSession = function (session) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.storeCallback(session)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_1 = _a.sent();
                        throw new ShopifyErrors.SessionStorageError("CustomSessionStorage failed to store a session. Error Details: " + error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CustomSessionStorage.prototype.loadSession = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result, error_2, session;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loadCallback(id)];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        throw new ShopifyErrors.SessionStorageError("CustomSessionStorage failed to load a session. Error Details: " + error_2);
                    case 3:
                        if (result) {
                            if (result instanceof session_1.Session) {
                                if (result.expires && typeof result.expires === 'string') {
                                    result.expires = new Date(result.expires);
                                }
                                return [2 /*return*/, result];
                            }
                            else if (result instanceof Object && 'id' in result) {
                                session = new session_1.Session(result.id, result.shop, result.state, result.isOnline);
                                session = tslib_1.__assign(tslib_1.__assign({}, session), result);
                                if (session.expires && typeof session.expires === 'string') {
                                    session.expires = new Date(session.expires);
                                }
                                return [2 /*return*/, session];
                            }
                            else {
                                throw new ShopifyErrors.SessionStorageError("Expected return to be instanceof Session, but received instanceof " + result.constructor.name + ".");
                            }
                        }
                        else {
                            return [2 /*return*/, undefined];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    CustomSessionStorage.prototype.deleteSession = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.deleteCallback(id)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_3 = _a.sent();
                        throw new ShopifyErrors.SessionStorageError("CustomSessionStorage failed to delete a session. Error Details: " + error_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CustomSessionStorage;
}());
exports.CustomSessionStorage = CustomSessionStorage;
