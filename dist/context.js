"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
var tslib_1 = require("tslib");
var ShopifyErrors = tslib_1.__importStar(require("./error"));
var memory_1 = require("./auth/session/storage/memory");
var base_types_1 = require("./base_types");
var scopes_1 = require("./auth/scopes");
var Context = {
    API_KEY: '',
    API_SECRET_KEY: '',
    SCOPES: new scopes_1.AuthScopes([]),
    HOST_NAME: '',
    API_VERSION: base_types_1.ApiVersion.Unstable,
    IS_EMBEDDED_APP: true,
    IS_PRIVATE_APP: false,
    SESSION_STORAGE: new memory_1.MemorySessionStorage(),
    initialize: function (params) {
        var scopes;
        if (params.SCOPES instanceof scopes_1.AuthScopes) {
            scopes = params.SCOPES;
        }
        else {
            scopes = new scopes_1.AuthScopes(params.SCOPES);
        }
        // Make sure that the essential params actually have content in them
        var missing = [];
        if (!params.API_KEY.length) {
            missing.push('API_KEY');
        }
        if (!params.API_SECRET_KEY.length) {
            missing.push('API_SECRET_KEY');
        }
        if (!scopes.toArray().length) {
            missing.push('SCOPES');
        }
        if (!params.HOST_NAME.length) {
            missing.push('HOST_NAME');
        }
        if (missing.length) {
            throw new ShopifyErrors.ShopifyError("Cannot initialize Shopify API Library. Missing values for: " + missing.join(', '));
        }
        this.API_KEY = params.API_KEY;
        this.API_SECRET_KEY = params.API_SECRET_KEY;
        this.SCOPES = scopes;
        this.HOST_NAME = params.HOST_NAME;
        this.API_VERSION = params.API_VERSION;
        this.IS_EMBEDDED_APP = params.IS_EMBEDDED_APP;
        this.IS_PRIVATE_APP = params.IS_PRIVATE_APP;
        if (params.SESSION_STORAGE) {
            this.SESSION_STORAGE = params.SESSION_STORAGE;
        }
        if (params.USER_AGENT_PREFIX) {
            this.USER_AGENT_PREFIX = params.USER_AGENT_PREFIX;
        }
        if (params.LOG_FILE) {
            this.LOG_FILE = params.LOG_FILE;
        }
        if (params.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN) {
            this.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN =
                params.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN;
        }
    },
    throwIfUninitialized: function () {
        if (!this.API_KEY || this.API_KEY.length === 0) {
            throw new ShopifyErrors.UninitializedContextError('Context has not been properly initialized. Please call the .initialize() method to setup your app context object.');
        }
    },
    throwIfPrivateApp: function (message) {
        if (Context.IS_PRIVATE_APP) {
            throw new ShopifyErrors.PrivateAppError(message);
        }
    },
};
exports.Context = Context;
