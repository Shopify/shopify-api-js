"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthScopes = void 0;
var tslib_1 = require("tslib");
var AuthScopes = /** @class */ (function () {
    function AuthScopes(scopes) {
        var scopesArray = [];
        if (typeof scopes === 'string') {
            scopesArray = scopes.split(new RegExp(AuthScopes.SCOPE_DELIMITER + "\\s*"));
        }
        else if (scopes) {
            scopesArray = scopes;
        }
        scopesArray = scopesArray
            .map(function (scope) { return scope.trim(); })
            .filter(function (scope) { return scope.length; });
        var impliedScopes = this.getImpliedScopes(scopesArray);
        var scopeSet = new Set(scopesArray);
        var impliedSet = new Set(impliedScopes);
        this.compressedScopes = new Set(tslib_1.__spread(scopeSet).filter(function (x) { return !impliedSet.has(x); }));
        this.expandedScopes = new Set(tslib_1.__spread(scopeSet, impliedSet));
    }
    AuthScopes.prototype.has = function (scope) {
        var _this = this;
        var other;
        if (scope instanceof AuthScopes) {
            other = scope;
        }
        else {
            other = new AuthScopes(scope);
        }
        return (other.toArray().filter(function (x) { return !_this.expandedScopes.has(x); }).length === 0);
    };
    AuthScopes.prototype.equals = function (otherScopes) {
        var other;
        if (otherScopes instanceof AuthScopes) {
            other = otherScopes;
        }
        else {
            other = new AuthScopes(otherScopes);
        }
        return (this.compressedScopes.size === other.compressedScopes.size &&
            this.toArray().filter(function (x) { return !other.has(x); }).length === 0);
    };
    AuthScopes.prototype.toString = function () {
        return this.toArray().join(AuthScopes.SCOPE_DELIMITER);
    };
    AuthScopes.prototype.toArray = function () {
        return tslib_1.__spread(this.compressedScopes);
    };
    AuthScopes.prototype.getImpliedScopes = function (scopesArray) {
        return scopesArray.reduce(function (array, current) {
            var matches = current.match(/^(unauthenticated_)?write_(.*)$/);
            if (matches) {
                array.push((matches[1] ? matches[1] : '') + "read_" + matches[2]);
            }
            return array;
        }, []);
    };
    AuthScopes.SCOPE_DELIMITER = ',';
    return AuthScopes;
}());
exports.AuthScopes = AuthScopes;
