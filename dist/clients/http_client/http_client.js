"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
var tslib_1 = require("tslib");
var querystring_1 = tslib_1.__importDefault(require("querystring"));
var crypto_1 = tslib_1.__importDefault(require("crypto"));
var fs_1 = tslib_1.__importDefault(require("fs"));
var node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
var network_1 = require("@shopify/network");
var ShopifyErrors = tslib_1.__importStar(require("../../error"));
var version_1 = require("../../version");
var shop_validator_1 = tslib_1.__importDefault(require("../../utils/shop-validator"));
var context_1 = require("../../context");
var types_1 = require("./types");
var HttpClient = /** @class */ (function () {
    function HttpClient(domain) {
        this.domain = domain;
        this.LOGGED_DEPRECATIONS = {};
        if (!shop_validator_1.default(domain)) {
            throw new ShopifyErrors.InvalidShopError("Domain " + domain + " is not valid");
        }
        this.domain = domain;
    }
    /**
     * Performs a GET request on the given path.
     */
    HttpClient.prototype.get = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.request(tslib_1.__assign({ method: network_1.Method.Get }, params))];
            });
        });
    };
    /**
     * Performs a POST request on the given path.
     */
    HttpClient.prototype.post = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.request(tslib_1.__assign({ method: network_1.Method.Post }, params))];
            });
        });
    };
    /**
     * Performs a PUT request on the given path.
     */
    HttpClient.prototype.put = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.request(tslib_1.__assign({ method: network_1.Method.Put }, params))];
            });
        });
    };
    /**
     * Performs a DELETE request on the given path.
     */
    HttpClient.prototype.delete = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.request(tslib_1.__assign({ method: network_1.Method.Delete }, params))];
            });
        });
    };
    HttpClient.prototype.request = function (params) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            function sleep(waitTime) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, waitTime); })];
                    });
                });
            }
            var maxTries, userAgent, headers, body, _a, type, data, queryString, url, options, tries, error_1, waitTime;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        maxTries = params.tries ? params.tries : 1;
                        if (maxTries <= 0) {
                            throw new ShopifyErrors.HttpRequestError("Number of tries must be >= 0, got " + maxTries);
                        }
                        userAgent = "Shopify API Library v" + version_1.SHOPIFY_API_LIBRARY_VERSION + " | Node " + process.version;
                        if (context_1.Context.USER_AGENT_PREFIX) {
                            userAgent = context_1.Context.USER_AGENT_PREFIX + " | " + userAgent;
                        }
                        if (params.extraHeaders) {
                            if (params.extraHeaders['user-agent']) {
                                userAgent = params.extraHeaders['user-agent'] + " | " + userAgent;
                                delete params.extraHeaders['user-agent'];
                            }
                            else if (params.extraHeaders['User-Agent']) {
                                userAgent = params.extraHeaders['User-Agent'] + " | " + userAgent;
                            }
                        }
                        headers = tslib_1.__assign(tslib_1.__assign({}, params.extraHeaders), { 'User-Agent': userAgent });
                        body = null;
                        if (params.method === network_1.Method.Post || params.method === network_1.Method.Put) {
                            _a = params, type = _a.type, data = _a.data;
                            if (data) {
                                switch (type) {
                                    case types_1.DataType.JSON:
                                        body = typeof data === 'string' ? data : JSON.stringify(data);
                                        break;
                                    case types_1.DataType.URLEncoded:
                                        body =
                                            typeof data === 'string'
                                                ? data
                                                : querystring_1.default.stringify(data);
                                        break;
                                    case types_1.DataType.GraphQL:
                                        body = data;
                                        break;
                                }
                                headers = tslib_1.__assign({ 'Content-Type': type, 'Content-Length': Buffer.byteLength(body) }, params.extraHeaders);
                            }
                        }
                        queryString = params.query
                            ? "?" + querystring_1.default.stringify(params.query)
                            : '';
                        url = "https://" + this.domain + params.path + queryString;
                        options = {
                            method: params.method.toString(),
                            headers: headers,
                            body: body,
                        };
                        tries = 0;
                        _b.label = 1;
                    case 1:
                        if (!(tries < maxTries)) return [3 /*break*/, 9];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 8]);
                        return [4 /*yield*/, this.doRequest(url, options)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        error_1 = _b.sent();
                        tries++;
                        if (!(error_1 instanceof ShopifyErrors.HttpRetriableError)) return [3 /*break*/, 7];
                        if (!(tries < maxTries)) return [3 /*break*/, 6];
                        waitTime = HttpClient.RETRY_WAIT_TIME;
                        if (error_1 instanceof ShopifyErrors.HttpThrottlingError &&
                            error_1.retryAfter) {
                            waitTime = error_1.retryAfter * 1000;
                        }
                        return [4 /*yield*/, sleep(waitTime)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 1];
                    case 6:
                        // We're set to multiple tries but ran out
                        if (maxTries > 1) {
                            throw new ShopifyErrors.HttpMaxRetriesError("Exceeded maximum retry count of " + maxTries + ". Last message: " + error_1.message);
                        }
                        _b.label = 7;
                    case 7: 
                    // We're not retrying or the error is not retriable, rethrow
                    throw error_1;
                    case 8: return [3 /*break*/, 1];
                    case 9: 
                    // We're never supposed to come this far, this is here only for the benefit of Typescript
                    /* istanbul ignore next */
                    throw new ShopifyErrors.ShopifyError("Unexpected flow, reached maximum HTTP tries but did not throw an error");
                }
            });
        });
    };
    HttpClient.prototype.doRequest = function (url, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, node_fetch_1.default(url, options)
                        .then(function (response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var body, deprecation, depHash, stack, log, errorMessages, errorMessage, retryAfter;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, response.json()];
                                case 1:
                                    body = _a.sent();
                                    if (response.ok) {
                                        if (response.headers &&
                                            response.headers.has('X-Shopify-API-Deprecated-Reason')) {
                                            deprecation = {
                                                message: response.headers.get('X-Shopify-API-Deprecated-Reason'),
                                                path: url,
                                            };
                                            depHash = crypto_1.default
                                                .createHash('md5')
                                                .update(JSON.stringify(deprecation))
                                                .digest('hex');
                                            if (!Object.keys(this.LOGGED_DEPRECATIONS).includes(depHash) ||
                                                Date.now() - this.LOGGED_DEPRECATIONS[depHash] >=
                                                    HttpClient.DEPRECATION_ALERT_DELAY) {
                                                this.LOGGED_DEPRECATIONS[depHash] = Date.now();
                                                if (context_1.Context.LOG_FILE) {
                                                    stack = new Error().stack;
                                                    log = "API Deprecation Notice " + new Date().toLocaleString() + " : " + JSON.stringify(deprecation) + "\n    Stack Trace: " + stack + "\n";
                                                    fs_1.default.writeFileSync(context_1.Context.LOG_FILE, log, {
                                                        flag: 'a',
                                                        encoding: 'utf-8',
                                                    });
                                                }
                                                else {
                                                    console.warn('API Deprecation Notice:', deprecation);
                                                }
                                            }
                                        }
                                        return [2 /*return*/, {
                                                body: body,
                                                headers: response.headers,
                                            }];
                                    }
                                    else {
                                        errorMessages = [];
                                        if (body.errors) {
                                            errorMessages.push(JSON.stringify(body.errors, null, 2));
                                        }
                                        if (response.headers && response.headers.get('x-request-id')) {
                                            errorMessages.push("If you report this error, please include this id: " + response.headers.get('x-request-id'));
                                        }
                                        errorMessage = errorMessages.length
                                            ? ":\n" + errorMessages.join('\n')
                                            : '';
                                        switch (true) {
                                            case response.status === network_1.StatusCode.TooManyRequests: {
                                                retryAfter = response.headers.get('Retry-After');
                                                throw new ShopifyErrors.HttpThrottlingError("Shopify is throttling requests" + errorMessage, retryAfter ? parseFloat(retryAfter) : undefined);
                                            }
                                            case response.status >= network_1.StatusCode.InternalServerError:
                                                throw new ShopifyErrors.HttpInternalError("Shopify internal error" + errorMessage);
                                            default:
                                                throw new ShopifyErrors.HttpResponseError("Received an error response (" + response.status + " " + response.statusText + ") from Shopify" + errorMessage, response.status, response.statusText);
                                        }
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (error) {
                        if (error instanceof ShopifyErrors.ShopifyError) {
                            throw error;
                        }
                        else {
                            throw new ShopifyErrors.HttpRequestError("Failed to make Shopify HTTP request: " + error);
                        }
                    })];
            });
        });
    };
    // 1 second
    HttpClient.RETRY_WAIT_TIME = 1000;
    // 5 minutes
    HttpClient.DEPRECATION_ALERT_DELAY = 300000;
    return HttpClient;
}());
exports.HttpClient = HttpClient;
