"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
var context_1 = require("../../context");
/**
 * Stores App information from logged in merchants so they can make authenticated requests to the Admin API.
 */
var Session = /** @class */ (function () {
    function Session(id, shop, state, isOnline) {
        this.id = id;
        this.shop = shop;
        this.state = state;
        this.isOnline = isOnline;
    }
    Session.cloneSession = function (session, newId) {
        var newSession = new Session(newId, session.shop, session.state, session.isOnline);
        newSession.scope = session.scope;
        newSession.expires = session.expires;
        newSession.accessToken = session.accessToken;
        newSession.onlineAccessInfo = session.onlineAccessInfo;
        return newSession;
    };
    Session.prototype.isActive = function () {
        var scopesUnchanged = context_1.Context.SCOPES.equals(this.scope);
        if (scopesUnchanged &&
            this.accessToken &&
            (!this.expires || this.expires >= new Date())) {
            return true;
        }
        return false;
    };
    return Session;
}());
exports.Session = Session;
