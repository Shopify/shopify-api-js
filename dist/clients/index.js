"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopifyClients = void 0;
var rest_1 = require("./rest");
var graphql_1 = require("./graphql");
var storefront_client_1 = require("./graphql/storefront_client");
var ShopifyClients = {
    Rest: rest_1.RestClient,
    Graphql: graphql_1.GraphqlClient,
    Storefront: storefront_client_1.StorefrontClient,
};
exports.ShopifyClients = ShopifyClients;
exports.default = ShopifyClients;
