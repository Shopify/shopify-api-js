"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSessionStorage = exports.MemorySessionStorage = exports.Session = void 0;
var session_1 = require("./session");
Object.defineProperty(exports, "Session", { enumerable: true, get: function () { return session_1.Session; } });
var memory_1 = require("./storage/memory");
Object.defineProperty(exports, "MemorySessionStorage", { enumerable: true, get: function () { return memory_1.MemorySessionStorage; } });
var custom_1 = require("./storage/custom");
Object.defineProperty(exports, "CustomSessionStorage", { enumerable: true, get: function () { return custom_1.CustomSessionStorage; } });
var ShopifySession = {
    Session: session_1.Session,
    MemorySessionStorage: memory_1.MemorySessionStorage,
    CustomSessionStorage: custom_1.CustomSessionStorage,
};
exports.default = ShopifySession;
